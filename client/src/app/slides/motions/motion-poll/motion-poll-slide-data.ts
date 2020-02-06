import { MotionPollMethods } from 'app/shared/models/motions/motion-poll';
import { MajorityMethod, PercentBase, PollState, PollType } from 'app/shared/models/poll/base-poll';
import { MotionTitleInformation } from 'app/site/motions/models/view-motion';

export interface MotionPollSlideData {
    motion: MotionTitleInformation;
    poll: {
        title: string;
        type: PollType;
        pollmethod: MotionPollMethods;
        state: PollState;
        onehundered_percent_base: PercentBase;
        majority_method: MajorityMethod;

        options: {
            yes?: string;
            no?: string;
            abstain?: string;
        }[];

        // optional for published polls:
        votesvalid: string;
        votesinvalid: string;
        votescast: string;
    };
}