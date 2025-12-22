export class RoundRobin {
  private sources: string[] = [];
  private currentIndex: number = 0;

  constructor(sources: string[]) {
    this.sources = sources;
  }

  add(element: string): void {
    this.sources.push(element);
  }

  getNext(): string {
    const currentIndex = this.currentIndex;

    this.currentIndex += 1;

    if (this.currentIndex >= this.sources.length) {
      this.currentIndex = 0;
    }

    return this.sources[currentIndex];
  }
}
