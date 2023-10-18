import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-drag-drop',
  templateUrl: './drag-drop.component.html',
  styleUrls: ['./drag-drop.component.scss']
})
export class DragDropComponent implements AfterViewInit {
  @ViewChild('myCanvas') canvas: ElementRef;
  private ctx: CanvasRenderingContext2D;
  private circleRadius = 30;
  private circles = [
    { x: 100, y: 100, isDraggable: true, startX: 100, startY: 100, color: 'blue' },
    { x: 200, y: 100, isDraggable: true, startX: 200, startY: 100, color: 'red' },
    { x: 300, y: 100, isDraggable: true, startX: 300, startY: 100, color: 'green' }
  ];
  private dropZone = { x: 400, y: 300, radius: 40 }; // Circular drop zone

  private selectedCircle: any = null;
  private isDragging = false;
  private circleInDropZone: any = null;

  ngAfterViewInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.drawCanvas();

    this.canvas.nativeElement.addEventListener('mousedown', (event) => this.onMouseDown(event));
    this.canvas.nativeElement.addEventListener('mousemove', (event) => this.onMouseMove(event));
    this.canvas.nativeElement.addEventListener('mouseup', () => this.onMouseUp());
  }

  drawCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    // Draw circular drop zone
    this.ctx.fillStyle = 'lightgray';
    this.ctx.beginPath();
    this.ctx.arc(this.dropZone.x, this.dropZone.y, this.dropZone.radius, 0, 2 * Math.PI);
    this.ctx.fill();

    const circleColors = ['blue', 'red', 'green'];

    this.circles.forEach((circle, index) => {
      this.ctx.fillStyle = circleColors[index];
      this.ctx.beginPath();
      this.ctx.arc(circle.x, circle.y, this.circleRadius, 0, 2 * Math.PI);
      this.ctx.fill();
    });
  }

  onMouseDown(event: MouseEvent) {
    const mouseX = event.clientX - this.canvas.nativeElement.getBoundingClientRect().left;
    const mouseY = event.clientY - this.canvas.nativeElement.getBoundingClientRect().top;

    this.circles.forEach(circle => {
      const dx = circle.x - mouseX;
      const dy = circle.y - mouseY;
      if (Math.sqrt(dx * dx + dy * dy) < this.circleRadius) {
        if (circle.isDraggable) {
          this.selectedCircle = circle;
          this.isDragging = true;
        }
      }
    });
  }

  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      const mouseX = event.clientX - this.canvas.nativeElement.getBoundingClientRect().left;
      const mouseY = event.clientY - this.canvas.nativeElement.getBoundingClientRect().top;

      this.selectedCircle.x = mouseX;
      this.selectedCircle.y = mouseY;

      this.drawCanvas();
    }
  }

  onMouseUp() {
    if (this.isDragging) {
      if (
        this.selectedCircle.x > this.dropZone.x - this.dropZone.radius &&
        this.selectedCircle.x < this.dropZone.x + this.dropZone.radius &&
        this.selectedCircle.y > this.dropZone.y - this.dropZone.radius &&
        this.selectedCircle.y < this.dropZone.y + this.dropZone.radius
      ) {
        if (this.circleInDropZone) {
          this.circleInDropZone.x = this.circleInDropZone.startX;
          this.circleInDropZone.y = this.circleInDropZone.startY;
          this.circleInDropZone.isDraggable = true;
        }

        this.selectedCircle.x = this.dropZone.x;
        this.selectedCircle.y = this.dropZone.y;
        this.selectedCircle.isDraggable = false;
        this.circleInDropZone = this.selectedCircle;
      } else {
        this.selectedCircle.x = this.selectedCircle.startX;
        this.selectedCircle.y = this.selectedCircle.startY;
      }

      this.isDragging = false;
      this.selectedCircle = null;

      this.drawCanvas();
    }
  }

  resetCircles() {
    this.circles.forEach(circle => {
      circle.x = circle.startX;
      circle.y = circle.startY;
      circle.isDraggable = true;
    });
  
    this.drawCanvas(); // Redraw the canvas to reflect the updated positions
  }
  
}
