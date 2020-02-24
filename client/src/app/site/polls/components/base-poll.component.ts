import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';

import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

import { BasePollDialogService } from 'app/core/ui-services/base-poll-dialog.service';
import { PromptService } from 'app/core/ui-services/prompt.service';
import { ChartData } from 'app/shared/components/charts/charts.component';
import { PollState } from 'app/shared/models/poll/base-poll';
import { BaseViewComponent } from 'app/site/base/base-view';
import { BasePollRepositoryService } from '../services/base-poll-repository.service';
import { ViewBasePoll } from '../models/view-base-poll';

export abstract class BasePollComponent<V extends ViewBasePoll> extends BaseViewComponent {
    public chartDataSubject: BehaviorSubject<ChartData> = new BehaviorSubject([]);

    protected _poll: V;

    public pollStateActions = {
        [PollState.Created]: {
            icon: 'play_arrow',
            css: 'start-poll-button'
        },
        [PollState.Started]: {
            icon: 'stop',
            css: 'stop-poll-button'
        },
        [PollState.Finished]: {
            icon: 'public',
            css: 'publish-poll-button'
        }
    };

    public constructor(
        titleService: Title,
        matSnackBar: MatSnackBar,
        public translate: TranslateService,
        public dialog: MatDialog,
        protected promptService: PromptService,
        protected repo: BasePollRepositoryService,
        protected pollDialog: BasePollDialogService<V>
    ) {
        super(titleService, translate, matSnackBar);
    }

    public async changeState(key: PollState): Promise<void> {
        if (key === PollState.Created) {
            const title = this.translate.instant('Are you sure you want to reset this poll? All Votes will be lost.');
            if (await this.promptService.open(title)) {
                this.repo.resetPoll(this._poll).catch(this.raiseError);
            }
        } else {
            this.repo.changePollState(this._poll).catch(this.raiseError);
        }
    }

    public resetState(): void {
        this.changeState(PollState.Created);
    }

    /**
     * Handler for the 'delete poll' button
     */
    public async onDeletePoll(): Promise<void> {
        const title = this.translate.instant('Are you sure you want to delete this poll?');
        if (await this.promptService.open(title)) {
            await this.repo.delete(this._poll).catch(this.raiseError);
        }
    }

    /**
     * Edits the poll
     */
    public openDialog(): void {
        this.pollDialog.openDialog(this._poll);
    }

    /**
     * Forces to initialize the poll.
     */
    protected initPoll(model: V): void {
        this._poll = model;
    }
}
