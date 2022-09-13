import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {

  transform(duration: number): string {
    const minutes = Math.floor(((duration / (1000 * 60)) % 60));
    const seconds = Math.floor((duration / 1000) % 60);
    return (seconds === 60 ? (minutes + 1) + ':00' : minutes + ':' + (seconds < 10 ? '0' : '') + seconds);
  }

}
