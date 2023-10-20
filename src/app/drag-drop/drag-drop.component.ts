import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-drag-drop',
  templateUrl: './drag-drop.component.html',
  styleUrls: ['./drag-drop.component.scss']
})
export class DragDropComponent implements AfterViewInit {
  @ViewChild('myCanvas') canvas: ElementRef;
  private ctx: CanvasRenderingContext2D;
  private circleRadius = 35;
  private circles = [
    { i: 0, x: 255, y: 200, isDraggable: true, startX: 255, startY: 200},
    { i: 1, x: 105, y: 265, isDraggable: true, startX: 105, startY: 265},
    { i: 2, x: 180, y: 340, isDraggable: true, startX: 180, startY: 340},
    { i: 3, x: 255, y: 415, isDraggable: true, startX: 255, startY: 415},
    { i: 4, x: 105, y: 485, isDraggable: true, startX: 105, startY: 485}
  ];
  private dropZone = { x: 187.5, y: 60, radius: 40 }; // Circular drop zone

  private selectedCircle: any = null;
  private isDragging = false;
  private circleInDropZone: any = null;

  ngAfterViewInit() {
    const canvas: HTMLCanvasElement = this.canvas.nativeElement;
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.drawCanvas();

    this.canvas.nativeElement.addEventListener('touchstart', (event) => this.onMouseDown(event));
    this.canvas.nativeElement.addEventListener('touchmove', (event) => this.onMouseMove(event));
    this.canvas.nativeElement.addEventListener('touchend', () => this.onMouseUp());

    canvas.addEventListener('touchstart', (event) => {
      event.preventDefault();
    });
  }

  drawCanvas(selectedCircle?: number) {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    // Draw circular drop zone
    this.ctx.fillStyle = 'lightgray';
    this.ctx.beginPath();
    this.ctx.arc(this.dropZone.x, this.dropZone.y, this.dropZone.radius, 0, 2 * Math.PI);
    this.ctx.fill();

    const circleColors = ['blue', 'red', 'green', 'yellow', 'orange'];


    

    this.circles.forEach((circle, index) => {
      this.ctx.fillStyle = circleColors[index];
      this.ctx.beginPath();
      this.ctx.arc(circle.x, circle.y, this.circleRadius, 0, 2 * Math.PI);
      this.ctx.fill();
    });

}

  onMouseDown(event: TouchEvent) {
    const mouseX = event.touches[0].clientX - this.canvas.nativeElement.getBoundingClientRect().left; // changed touch
    const mouseY = event.touches[0].clientY - this.canvas.nativeElement.getBoundingClientRect().top; // changed touch

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

  onMouseMove(event: TouchEvent) {
    if (this.isDragging) {
      const mouseX = event.touches[0].clientX - this.canvas.nativeElement.getBoundingClientRect().left;
      const mouseY = event.touches[0].clientY - this.canvas.nativeElement.getBoundingClientRect().top;

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
