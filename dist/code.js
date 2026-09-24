// PSD to Figma Importer - Main Process (Compiled)
// Runs in Figma plugin sandbox

figma.showUI(__html__, { width: 450, height: 600 });

let nodeCount = 0;

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'import-psd') {
    try {
      nodeCount = 0;
      const psdData = msg.data
      
      // Create a frame for the PSD content
      const psdFrame = figma.createFrame();
      psdFrame.name = "PSD Import";
      psdFrame.resize(psdData.width, psdData.height);
      psdFrame.x = 100;
      psdFrame.y = 100;
      psdFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
      
      // Process all children
      for (const child of psdData.children) {
        await processNode(child, psdFrame);
      }
      
      // Select the frame
      figma.currentPage.selection = [psdFrame];
      figma.viewport.scrollAndZoomIntoView([psdFrame]);
      
      figma.ui.postMessage({
        type: 'import-success',
        nodeCount: nodeCount
      });
      
    } catch (error) {
      console.error('Import error:', error);
      figma.ui.postMessage({
        type: 'import-error',
        error: error.message
      });
    }
  }
};

async function processNode(psdNode, parent) {
  nodeCount++
  
  const nodeWidth = psdNode.right - psdNode.left;
  const nodeHeight = psdNode.bottom - psdNode.top;
  const x = psdNode.left;
  const y = psdNode.top;
  
  let figmaNode;
  
  if (psdNode.type === 'text' && psdNode.text) {
    // Create editable text node
    figmaNode = figma.createText();
    await figmaNode.loadFontAsync(getFontName(psdNode.text.style));
    
    figmaNode.characters = psdNode.text.content;
    figmaNode.fontSize = psdNode.text.style.fontSize || 16;
    
    // Apply text color
    if (psdNode.text.style.fillColor) {
      const color = psdNode.text.style.fillColor;
      figmaNode.fills = [{
        type: 'SOLID',
        color: {
          r: color.r || 0,
          g: color.g || 0,
          b: color.b || 0
        }
      }];
    }
    
    // Apply line height if available
    if (psdNode.text.style.lineHeight) {
      figmaNode.lineHeight = {
        value: psdNode.text.style.lineHeight,
        unit: 'PIXELS'
      };
    }
    
    figmaNode.x = x;
    figmaNode.y = y;
    
  } else if (psdNode.type === 'image' && psdNode.imageData) {
    // Create image node
    figmaNode = figma.createFrame();
    figmaNode.resize(nodeWidth, nodeHeight);
    figmaNode.x = x;
    figmaNode.y = y;
    
    try {
      // Convert base64 to bytes
      const base64Data = psdNode.imageData.replace(/^data:image\/png;base64,/, '');
      const imageBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
      
      const imageHash = await figma.createImage(imageBytes).hash;
      figmaNode.fills = [{
        type: 'IMAGE',
        hash: imageHash,
        scaleMode: 'FILL'
      }];
    } catch (e) {
      console.warn('Could not create image:', e);
      figmaNode.fills = [{ type: 'SOLID', color: { r: 0.8, g: 0.8, b: 0.8 } }];
    }
    
  } else if (psdNode.children && psdNode.children.length > 0) {
    // Create group/frame for nested layers
    figmaNode = figma.createFrame();
    figmaNode.name = psdNode.name || 'Group';
    figmaNode.resize(nodeWidth, nodeHeight);
    figmaNode.x = x;
    figmaNode.y = y;
    figmaNode.fills = []; // Transparent by default
    
    // Process children
    for (const child of psdNode.children) {
      await processNode(child, figmaNode);
    }
    
  } else {
    // Default rectangle for simple layers
    figmaNode = figma.createRectangle();
    figmaNode.resize(nodeWidth, nodeHeight);
    figmaNode.x = x;
    figmaNode.y = y;
    figmaNode.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
  }
  
  // Common properties
  figmaNode.name = psdNode.name || `Layer ${nodeCount}`;
  figmaNode.opacity = psdNode.opacity !== undefined ? psdNode.opacity : 1;
  figmaNode.visible = psdNode.visible !== false;
  
  // Add to parent
  parent.appendChild(figmaNode);
  
  return figmaNode;
}

function getFontName(textStyle) {
  // Try to match PSD font to available Figma fonts
  const fontFamily = textStyle.fontFamily || 'Arial';
  const fontWeight = textStyle.fontWeight || 'normal';
  
  // Map common PSD fonts to Figma available fonts
  const fontMap = {
    'Arial': 'Inter',
    'Helvetica': 'Inter',
    'Times New Roman': 'Georgia',
    'Georgia': 'Georgia',
    'Verdana': 'Inter',
    'Tahoma': 'Inter',
    'Courier New': 'Courier New',
    'Impact': 'Inter'
  };
  
  const figmaFontFamily = fontMap[fontFamily] || 'Inter';
  
  // Weight mapping
  let weight = 'Regular';
  if (fontWeight === 'bold' || fontWeight === 700) {
    weight = 'Bold';
  } else if (fontWeight === 'light' || fontWeight === 300) {
    weight = 'Light';
  }
  
  return { family: figmaFontFamily, style: weight };
}