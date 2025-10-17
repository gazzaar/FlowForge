# FlowForge

A modern, interactive flow diagram builder built with React, TypeScript, and React Flow. FlowForge allows you to create, edit, and visualize workflow diagrams with drag-and-drop functionality, custom nodes, and export capabilities.

## Features

- **Drag & Drop Interface**: Create nodes by dragging from the sidebar onto the canvas
- **Custom Nodes**: Editable nodes with text areas for detailed descriptions
- **Cycle Detection**: Prevents creating circular dependencies in your flow
- **Auto-save**: Automatically saves your work to localStorage
- **Export to Image**: Download your flow diagrams as PNG images
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Built with Material-UI for a clean, professional interface

```
src/
├── components/ # Reusable UI components
│ ├── ActionList.tsx # List of draggable action items
│ ├── CustomNode.tsx # Custom node component for the flow
│ ├── NewAction.tsx # Form to create new actions
│ └── StoreButton.tsx # Button component for actions
├── utils/ # Utility functions
│ └── downloadImage.ts # Image download functionality
├── App.tsx # Main application component
├── DnDFlow.tsx # Main flow diagram component
├── DnDContext.tsx # Drag and drop context provider
├── SideBar.tsx # Sidebar with action templates
├── types.ts # TypeScript type definitions
├── config.ts # Application configuration
└── main.tsx # Application entry point

```

##  How to Use

1. **Create Actions**: Add new action templates in the sidebar by typing and pressing Enter
2. **Build Your Flow**: Drag actions from the sidebar onto the canvas
3. **Connect Nodes**: Click and drag from one node to another to create connections
4. **Edit Content**: Click on nodes to add detailed descriptions in the text area
5. **Save Your Work**: Your flow is automatically saved to localStorage
6. **Export**: Use the "Download an Image" button to export your diagram
7. **Clear**: Use the "Clear" button to start fresh

##  Key Technologies

- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **React Flow** - Powerful flow diagram library
- **Material-UI** - Modern component library
- **Vite** - Fast build tool and dev server
- **React Hot Toast** - User notifications
