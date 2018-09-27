import moment from 'moment';

export class CacheEntry<T> {
	data: T;
	lastModifiedDate: moment.Moment;
}