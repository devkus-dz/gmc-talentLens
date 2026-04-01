import { BaseRepository } from './BaseRepository';
import JobOfferModel, { IJobOffer } from '../models/JobOffer';

class JobOfferRepository extends BaseRepository<IJobOffer> {
    constructor() {
        super(JobOfferModel);
    }
}

export const jobOfferRepository = new JobOfferRepository();