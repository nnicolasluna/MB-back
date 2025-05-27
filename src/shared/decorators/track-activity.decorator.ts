import { SetMetadata, UseInterceptors, applyDecorators } from '@nestjs/common';
import { ActivityTrackerInterceptor } from '../interceptors/activity-tracker.interceptor';

export const ACTIVITY_LOG_METADATA_KEY = 'activity-log-description';
/**
 * Decorator to track activity on a method
 * @param logDescription Optional description to be logged if not provided the method name will be used 'logDescription' from the request
 * @returns void
 */
export const TrackActivity = (logDescription: string | undefined = undefined) =>
	applyDecorators(SetMetadata(ACTIVITY_LOG_METADATA_KEY, logDescription), UseInterceptors(ActivityTrackerInterceptor));
