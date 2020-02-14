import { forwardRef, Inject, Input } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { SlideData } from 'app/core/core-services/projector-data.service';
import { ChartData } from 'app/shared/components/charts/charts.component';
import { PollState } from 'app/shared/models/poll/base-poll';
import { PollService } from 'app/site/polls/services/poll.service';
import { BasePollSlideData } from './base-poll-slide-data';
import { BaseSlideComponent } from '../base-slide-component';

export class BasePollSlideComponent<T extends BasePollSlideData> extends BaseSlideComponent<T> {
    public chartDataSubject: BehaviorSubject<ChartData> = new BehaviorSubject([]);

    @Input()
    public set data(value: SlideData<T>) {
        this._data = value;
        if (value.data.poll.state === PollState.Published) {
            const chartData = this.pollService.generateChartData(value.data.poll);
            this.chartDataSubject.next(chartData);
        }
    }

    public get data(): SlideData<T> {
        return this._data;
    }

    private _data: SlideData<T>;

    public constructor(
        @Inject(forwardRef(() => PollService))
        public pollService: PollService
    ) {
        super();
    }
}
