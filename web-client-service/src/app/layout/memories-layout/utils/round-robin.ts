import { MemorySourceModel } from '../../../core/domain';

export class RoundRobin {
  private sources: MemorySourceModel[] = [];
  private currentIndex: number | undefined = undefined;

  constructor(sources: MemorySourceModel[]) {
    this.sources = sources;
  }

  getLength(): number {
    return this.sources.length;
  }

  add(element: MemorySourceModel): void {
    this.sources.push(element);
  }

  getNext(): MemorySourceModel {
    if (this.currentIndex === undefined) {
      this.currentIndex = 0;
      return this.sources[this.currentIndex];
    }

    this.currentIndex += 1;

    if (this.currentIndex >= this.sources.length) {
      this.currentIndex = 0;
    }

    console.log('returning index: ', this.currentIndex);

    return this.sources[this.currentIndex];
  }

  getPrevious(): MemorySourceModel {
    if (this.currentIndex === undefined) {
      this.currentIndex = 0;
      return this.sources[this.currentIndex];
    }

    this.currentIndex -= 1;

    if (this.currentIndex < 0) {
      this.currentIndex = this.getLength() - 1;
    }

    console.log('returning index: ', this.currentIndex);

    return this.sources[this.currentIndex];
  }

  getCurrent(): MemorySourceModel {
    return this.sources[this.currentIndex ?? 0];
  }
}
