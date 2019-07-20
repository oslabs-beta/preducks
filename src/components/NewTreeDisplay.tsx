import Tree from 'react-d3-tree';
import React, { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { ComponentInt, ComponentsInt, ChildInt } from '../utils/interfaces';

interface TreeInt {
  name: string;
  attributes: { [key: string]: { value: string } };
  children: TreeInt[];
}

interface PropsInt {
  focusChild: ChildInt;
  components: ComponentsInt;
  focusComponent: ComponentInt;
  classes: any;
}

const styles = (theme: any): any => ({
  root: {
    flexGrow: 1,
    backgroundColor: '#333333',
    height: '100%',
    color: '#fff',
    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
  },
  tabsRoot: {
    borderBottom: '0.5px solid #424242',
  },
  tabsIndicator: {
    backgroundColor: '#1de9b6',
  },
  tabRoot: {
    textTransform: 'initial',
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing.unit * 4,

    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      color: '#1de9b6',
      opacity: 1,
    },
    '&$tabSelected': {
      color: '#33eb91',
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&:focus': {
      color: '#4aedc4',
    },
  },
  tabSelected: {},
  typography: {
    padding: theme.spacing.unit * 3,
  },
  padding: {
    padding: `0 ${theme.spacing.unit * 2}px`,
  },
});

const TreeDisplay: React.FC<PropsInt> = (props): JSX.Element => {
  const [translation, setTranslation] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);

  let treeWrapper;

  const handleResize = () => {
    if (treeWrapper) {
      const treeSize = document.querySelector('g').getBBox();
      const container = treeWrapper.getBoundingClientRect();
      const containerToTreeWidthRatio = container.width / treeSize.width;
      setTranslation({ x: container.width / 2, y: container.height / 2.9 });
      setZoomLevel(containerToTreeWidthRatio);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  useEffect(() => {
    // ('using effect bc focusComp or components changed');
    // have to add this in bc useEffect above can't find treeWrapper dom node on first render
    handleResize();
  }, [props.components, props.focusComponent]);

  return (
    <div
      id="treeWrapper"
      style={{
        width: '100%',
        height: '100%',
      }}
      ref={node => (treeWrapper = node)}>
      <Tree
        data={[generateComponentTree(props.focusComponent.id, props.components)]}
        separation={{ siblings: 1, nonSiblings: 1 }}
        transitionDuration={0}
        translate={translation}
        collapsible={false}
        zoomable={true}
        zoom={zoomLevel}
        orientation={'vertical'}
        textLayout={{
          textAnchor: 'middle',
          x: 0,
          y: 0,
          transform: undefined,
        }}
        styles={{
          links: {
            stroke: '#41B3A3',
            strokeWidth: 4,
          },
          nodes: {
            node: {
              name: {
                fill: '#FFFFFF',
                stroke: '#FFFFFF',
                strokeWidth: 1,
                fontSize: '20px',
              },
              circle: { stroke: '#FFFFFF' },
            },
            leafNode: {
              name: {
                fill: '#FFFFFF',
                stroke: '#FFFFFF',
                strokeWidth: 1,
                fontSize: '20px',
              },
              circle: { stroke: '#FFFFFF' },
            },
          },
        }}
      />
    </div>
  );
};

export default withStyles(styles)(TreeDisplay);

function generateComponentTree(componentId: number, components: ComponentsInt) {
  const component = components.find(comp => comp.id === componentId);
  const tree = {
    name: component.title,
    attributes: {},
    children: [],
    nodeSvgShape: createShape(65, component.color),
  };
  component.childrenArray.forEach((child) => {
    if (child.childType === 'COMP') {
      tree.children.push(generateComponentTree(child.childComponentId, components));
    } else {
      tree.children.push({
        name: child.componentName,
        attributes: {},
        children: [],
        nodeSvgShape: createShape(50, '#007BFF'),
      });
    }
  });
  return tree;
}

function createShape(size, color) {
  return {
    shape: 'circle',
    shapeProps: {
      r: size,
      fill: color,
      stroke: hexToHSL(color),
    },
  };
}

const randomColor = `rgb(${Math.floor(255 * Math.random())},${Math.floor(
  255 * Math.random(),
)},${Math.floor(255 * Math.random())})`;

function hexToHSL(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  let r = parseInt(result[1], 16);
  let g = parseInt(result[2], 16);
  let b = parseInt(result[3], 16);
  (r /= 255), (g /= 255), (b /= 255);
  let max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = (max + min) / 2;
  let s = (max + min) / 2;
  const l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return `hsl(${h * 360},50%,50%)`;
}
