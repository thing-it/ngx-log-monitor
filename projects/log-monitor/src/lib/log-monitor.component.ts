import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input, NgZone,
  OnChanges, OnDestroy,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {LogMessage} from './models/log-message.model';
import {normalizeLogMessage} from './helpers/log-message.helper';
import {Observable, Subscription} from 'rxjs';

@Component({
  selector: 'log-monitor',
  templateUrl: './log-monitor.component.html',
  styleUrls: ['./log-monitor.component.scss'],
  standalone: false,
})
export class LogMonitorComponent implements OnChanges, AfterViewInit, OnDestroy {

  @Input() title;
  @Input() logStream: Observable<LogMessage>;
  @Input() history: LogMessage[] = [];
  @Input() theme: 'dark' | 'light' = 'dark';
  @Input() icons = true;
  @Input() customClass = 'log-container';
  @Input() animated = true;
  @ViewChild('container', {static: false}) container: ElementRef;

  private subscription: Subscription;

  constructor(private zone: NgZone) { }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['history']) {
      this.history = changes['history'].currentValue.map(normalizeLogMessage);
    }

    if (changes['logStream']) {
      this.subscription = this.logStream.subscribe(log =>  {
        const normalizedMsg = normalizeLogMessage(log);
        this.history.push(normalizedMsg);
        setTimeout(() => this.scrollToBottom());
      });
    }
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private scrollToBottom() {
    this.container.nativeElement.scrollTop = this.container.nativeElement.scrollHeight;
  }

}
