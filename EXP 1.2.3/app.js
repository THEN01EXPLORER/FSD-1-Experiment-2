/**
 * SVG Drawing Tool
 * Interactive drawing application with mouse event handlers
 */

class SVGDrawingTool {
    constructor() {
        // Canvas and state
        this.canvas = document.getElementById('svgCanvas');
        this.isDrawing = false;
        this.currentShape = null;
        this.startX = 0;
        this.startY = 0;
        this.shapes = [];
        this.undoStack = [];

        // Tool settings
        this.currentTool = 'rectangle';
        this.fillColor = '#6366f1';
        this.strokeColor = '#1e1b4b';
        this.strokeWidth = 2;
        this.opacity = 0.8;
        this.fillEnabled = true;

        // Freehand drawing
        this.freehandPath = '';
        this.freehandPoints = [];

        // DOM Elements
        this.elements = {
            fillColor: document.getElementById('fillColor'),
            strokeColor: document.getElementById('strokeColor'),
            strokeWidth: document.getElementById('strokeWidth'),
            strokeWidthValue: document.getElementById('strokeWidthValue'),
            opacity: document.getElementById('opacity'),
            opacityValue: document.getElementById('opacityValue'),
            fillEnabled: document.getElementById('fillEnabled'),
            mousePosition: document.getElementById('mousePosition'),
            shapeCount: document.getElementById('shapeCount'),
            currentTool: document.getElementById('currentTool'),
            drawingStatus: document.getElementById('drawingStatus'),
            undoBtn: document.getElementById('undoBtn'),
            clearBtn: document.getElementById('clearBtn'),
            shortcutsModal: document.getElementById('shortcutsModal'),
            closeModal: document.getElementById('closeModal')
        };

        this.init();
    }

    init() {
        this.bindCanvasEvents();
        this.bindToolbarEvents();
        this.bindKeyboardEvents();
        this.updateShapeCount();
    }

    // ==================== Canvas Events ====================
    bindCanvasEvents() {
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('mouseleave', (e) => this.handleMouseLeave(e));

        // Touch support for mobile devices
        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e));
    }

    getMousePosition(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    handleMouseDown(e) {
        if (e.button !== 0) return; // Only left click

        const pos = this.getMousePosition(e);
        this.isDrawing = true;
        this.startX = pos.x;
        this.startY = pos.y;

        this.updateStatus('Drawing...');
        this.createShape(pos.x, pos.y);
    }

    handleMouseMove(e) {
        const pos = this.getMousePosition(e);
        this.updateMousePosition(pos.x, pos.y);

        if (!this.isDrawing || !this.currentShape) return;

        this.updateShape(pos.x, pos.y);
    }

    handleMouseUp(e) {
        if (!this.isDrawing) return;

        this.finishDrawing();
    }

    handleMouseLeave(e) {
        if (this.isDrawing) {
            this.cancelDrawing();
        }
    }

    // Touch event handlers
    handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY,
            button: 0
        });
        this.handleMouseDown(mouseEvent);
    }

    handleTouchMove(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        this.handleMouseMove(mouseEvent);
    }

    handleTouchEnd(e) {
        e.preventDefault();
        this.handleMouseUp(e);
    }

    // ==================== Shape Creation ====================
    createShape(x, y) {
        const fill = this.fillEnabled ? this.fillColor : 'none';
        const commonAttrs = {
            fill,
            stroke: this.strokeColor,
            'stroke-width': this.strokeWidth,
            opacity: this.opacity,
            class: 'shape'
        };

        switch (this.currentTool) {
            case 'rectangle':
                this.currentShape = this.createSVGElement('rect', {
                    ...commonAttrs,
                    x, y,
                    width: 0,
                    height: 0,
                    rx: 4,
                    ry: 4
                });
                break;

            case 'circle':
                this.currentShape = this.createSVGElement('circle', {
                    ...commonAttrs,
                    cx: x,
                    cy: y,
                    r: 0
                });
                break;

            case 'ellipse':
                this.currentShape = this.createSVGElement('ellipse', {
                    ...commonAttrs,
                    cx: x,
                    cy: y,
                    rx: 0,
                    ry: 0
                });
                break;

            case 'line':
                this.currentShape = this.createSVGElement('line', {
                    ...commonAttrs,
                    fill: 'none',
                    x1: x,
                    y1: y,
                    x2: x,
                    y2: y,
                    'stroke-linecap': 'round'
                });
                break;

            case 'triangle':
                this.currentShape = this.createSVGElement('polygon', {
                    ...commonAttrs,
                    points: `${x},${y} ${x},${y} ${x},${y}`
                });
                break;

            case 'freehand':
                this.freehandPoints = [{ x, y }];
                this.freehandPath = `M ${x} ${y}`;
                this.currentShape = this.createSVGElement('path', {
                    ...commonAttrs,
                    fill: 'none',
                    d: this.freehandPath,
                    'stroke-linecap': 'round',
                    'stroke-linejoin': 'round'
                });
                break;
        }

        if (this.currentShape) {
            this.canvas.appendChild(this.currentShape);
        }
    }

    updateShape(x, y) {
        if (!this.currentShape) return;

        switch (this.currentTool) {
            case 'rectangle':
                const rectX = Math.min(this.startX, x);
                const rectY = Math.min(this.startY, y);
                const width = Math.abs(x - this.startX);
                const height = Math.abs(y - this.startY);
                this.setAttributes(this.currentShape, {
                    x: rectX,
                    y: rectY,
                    width,
                    height
                });
                break;

            case 'circle':
                const radius = Math.sqrt(
                    Math.pow(x - this.startX, 2) + Math.pow(y - this.startY, 2)
                );
                this.setAttributes(this.currentShape, { r: radius });
                break;

            case 'ellipse':
                const rx = Math.abs(x - this.startX);
                const ry = Math.abs(y - this.startY);
                this.setAttributes(this.currentShape, { rx, ry });
                break;

            case 'line':
                this.setAttributes(this.currentShape, { x2: x, y2: y });
                break;

            case 'triangle':
                const baseWidth = (x - this.startX) * 2;
                const height2 = y - this.startY;
                const points = [
                    `${this.startX},${this.startY}`,
                    `${this.startX - baseWidth / 2},${this.startY + height2}`,
                    `${this.startX + baseWidth / 2},${this.startY + height2}`
                ].join(' ');
                this.setAttributes(this.currentShape, { points });
                break;

            case 'freehand':
                this.freehandPoints.push({ x, y });
                this.freehandPath += ` L ${x} ${y}`;
                this.setAttributes(this.currentShape, { d: this.freehandPath });
                break;
        }
    }

    finishDrawing() {
        if (this.currentShape) {
            // Check if shape has minimal size
            if (this.isValidShape()) {
                this.shapes.push(this.currentShape);
                this.undoStack = []; // Clear redo stack on new shape
                this.updateShapeCount();
            } else {
                this.canvas.removeChild(this.currentShape);
            }
        }

        this.isDrawing = false;
        this.currentShape = null;
        this.freehandPath = '';
        this.freehandPoints = [];
        this.updateStatus('Ready');
    }

    cancelDrawing() {
        if (this.currentShape) {
            this.canvas.removeChild(this.currentShape);
        }
        this.isDrawing = false;
        this.currentShape = null;
        this.freehandPath = '';
        this.freehandPoints = [];
        this.updateStatus('Cancelled');
        setTimeout(() => this.updateStatus('Ready'), 1000);
    }

    isValidShape() {
        if (!this.currentShape) return false;

        switch (this.currentTool) {
            case 'rectangle':
            case 'ellipse':
                return parseFloat(this.currentShape.getAttribute('width') || 
                       this.currentShape.getAttribute('rx')) > 5;
            case 'circle':
                return parseFloat(this.currentShape.getAttribute('r')) > 5;
            case 'line':
                const x1 = parseFloat(this.currentShape.getAttribute('x1'));
                const y1 = parseFloat(this.currentShape.getAttribute('y1'));
                const x2 = parseFloat(this.currentShape.getAttribute('x2'));
                const y2 = parseFloat(this.currentShape.getAttribute('y2'));
                return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) > 5;
            case 'freehand':
                return this.freehandPoints.length > 3;
            case 'triangle':
                return true;
            default:
                return true;
        }
    }

    // ==================== Toolbar Events ====================
    bindToolbarEvents() {
        // Tool selection
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentTool = btn.dataset.tool;
                this.updateCurrentTool();
            });
        });

        // Color pickers
        this.elements.fillColor.addEventListener('input', (e) => {
            this.fillColor = e.target.value;
        });

        this.elements.strokeColor.addEventListener('input', (e) => {
            this.strokeColor = e.target.value;
        });

        // Color presets
        document.querySelectorAll('#fillPresets .color-preset').forEach(btn => {
            btn.addEventListener('click', () => {
                this.fillColor = btn.dataset.color;
                this.elements.fillColor.value = btn.dataset.color;
            });
        });

        document.querySelectorAll('#strokePresets .color-preset').forEach(btn => {
            btn.addEventListener('click', () => {
                this.strokeColor = btn.dataset.color;
                this.elements.strokeColor.value = btn.dataset.color;
            });
        });

        // Stroke width
        this.elements.strokeWidth.addEventListener('input', (e) => {
            this.strokeWidth = parseInt(e.target.value);
            this.elements.strokeWidthValue.textContent = `${this.strokeWidth}px`;
        });

        // Opacity
        this.elements.opacity.addEventListener('input', (e) => {
            this.opacity = parseFloat(e.target.value);
            this.elements.opacityValue.textContent = `${Math.round(this.opacity * 100)}%`;
        });

        // Fill toggle
        this.elements.fillEnabled.addEventListener('change', (e) => {
            this.fillEnabled = e.target.checked;
        });

        // Action buttons
        this.elements.undoBtn.addEventListener('click', () => this.undo());
        this.elements.clearBtn.addEventListener('click', () => this.clearCanvas());

        // Modal
        this.elements.closeModal.addEventListener('click', () => this.hideShortcutsModal());
        this.elements.shortcutsModal.addEventListener('click', (e) => {
            if (e.target === this.elements.shortcutsModal) {
                this.hideShortcutsModal();
            }
        });
    }

    // ==================== Keyboard Events ====================
    bindKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            // Don't trigger shortcuts when typing in inputs
            if (e.target.tagName === 'INPUT') return;

            const key = e.key.toLowerCase();

            // Tool shortcuts
            const toolMap = {
                'r': 'rectangle',
                'c': 'circle',
                'e': 'ellipse',
                'l': 'line',
                't': 'triangle',
                'f': 'freehand'
            };

            if (toolMap[key]) {
                this.selectTool(toolMap[key]);
                return;
            }

            // Action shortcuts
            if (e.ctrlKey && key === 'z') {
                e.preventDefault();
                this.undo();
                return;
            }

            if (key === 'delete' || key === 'backspace') {
                if (e.ctrlKey || e.shiftKey) {
                    e.preventDefault();
                    this.clearCanvas();
                }
                return;
            }

            if (key === 'escape') {
                this.cancelDrawing();
                this.hideShortcutsModal();
                return;
            }

            if (key === 'h') {
                this.toggleShortcutsModal();
                return;
            }
        });
    }

    selectTool(tool) {
        this.currentTool = tool;
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tool === tool);
        });
        this.updateCurrentTool();
    }

    // ==================== Actions ====================
    undo() {
        if (this.shapes.length === 0) return;

        const lastShape = this.shapes.pop();
        this.undoStack.push(lastShape);
        this.canvas.removeChild(lastShape);
        this.updateShapeCount();
        this.showNotification('Undo successful');
    }

    redo() {
        if (this.undoStack.length === 0) return;

        const shape = this.undoStack.pop();
        this.shapes.push(shape);
        this.canvas.appendChild(shape);
        this.updateShapeCount();
    }

    clearCanvas() {
        if (this.shapes.length === 0) return;

        // Store all shapes for potential undo
        this.shapes.forEach(shape => {
            this.canvas.removeChild(shape);
        });
        this.undoStack = [...this.shapes];
        this.shapes = [];
        this.updateShapeCount();
        this.showNotification('Canvas cleared');
    }

    // ==================== UI Updates ====================
    updateMousePosition(x, y) {
        this.elements.mousePosition.textContent = `X: ${Math.round(x)}, Y: ${Math.round(y)}`;
    }

    updateShapeCount() {
        this.elements.shapeCount.textContent = `Shapes: ${this.shapes.length}`;
    }

    updateCurrentTool() {
        const toolNames = {
            'rectangle': 'Rectangle',
            'circle': 'Circle',
            'ellipse': 'Ellipse',
            'line': 'Line',
            'triangle': 'Triangle',
            'freehand': 'Freehand'
        };
        this.elements.currentTool.textContent = `Tool: ${toolNames[this.currentTool]}`;
    }

    updateStatus(status) {
        this.elements.drawingStatus.textContent = status;
    }

    showNotification(message) {
        // Create temporary notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 60px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #6366f1, #4f46e5);
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
            animation: slideUp 0.3s ease, fadeOut 0.3s ease 2s forwards;
            z-index: 1000;
        `;

        // Add animation keyframes if not already present
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideUp {
                    from { transform: translateX(-50%) translateY(20px); opacity: 0; }
                    to { transform: translateX(-50%) translateY(0); opacity: 1; }
                }
                @keyframes fadeOut {
                    to { opacity: 0; transform: translateX(-50%) translateY(-10px); }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2500);
    }

    toggleShortcutsModal() {
        this.elements.shortcutsModal.classList.toggle('hidden');
    }

    hideShortcutsModal() {
        this.elements.shortcutsModal.classList.add('hidden');
    }

    // ==================== Utility Functions ====================
    createSVGElement(tagName, attributes) {
        const element = document.createElementNS('http://www.w3.org/2000/svg', tagName);
        this.setAttributes(element, attributes);
        return element;
    }

    setAttributes(element, attributes) {
        for (const [key, value] of Object.entries(attributes)) {
            element.setAttribute(key, value);
        }
    }
}

// Initialize the drawing tool when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.drawingTool = new SVGDrawingTool();
});
