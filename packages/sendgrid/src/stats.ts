import { getSendGridClient, log } from './client';
import { handleSendGridError } from './errors';
import { EmailStats } from './types';

/**
 * Get email statistics
 */
export async function getEmailStats(
  startDate: Date,
  endDate?: Date,
  aggregatedBy?: 'day' | 'week' | 'month'
): Promise<EmailStats> {
  log('stats.get.start', { startDate, endDate, aggregatedBy });

  try {
    const client = getSendGridClient();
    
    const queryParams: any = {
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate ? endDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    };
    
    if (aggregatedBy) {
      queryParams.aggregated_by = aggregatedBy;
    }

    const [response, body] = await client.request({
      method: 'GET',
      url: '/v3/stats',
      qs: queryParams,
    });

    // Aggregate stats from all periods
    const stats: EmailStats = {
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      bounced: 0,
      spam: 0,
      unsubscribed: 0,
    };

    for (const period of body) {
      const metrics = period.stats[0]?.metrics || {};
      stats.sent += metrics.requests || 0;
      stats.delivered += metrics.delivered || 0;
      stats.opened += metrics.opens || 0;
      stats.clicked += metrics.clicks || 0;
      stats.bounced += metrics.bounces || 0;
      stats.spam += metrics.spam_reports || 0;
      stats.unsubscribed += metrics.unsubscribes || 0;
    }

    log('stats.get.success', stats);
    return stats;
  } catch (error) {
    log('stats.get.error', error);
    throw handleSendGridError(error);
  }
}

/**
 * Get category statistics
 */
export async function getCategoryStats(
  categories: string[],
  startDate: Date,
  endDate?: Date
): Promise<Record<string, EmailStats>> {
  log('stats.category.start', { categories, startDate, endDate });

  try {
    const client = getSendGridClient();
    
    const queryParams: any = {
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate ? endDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      categories: categories.join(','),
      aggregated_by: 'category',
    };

    const [response, body] = await client.request({
      method: 'GET',
      url: '/v3/categories/stats',
      qs: queryParams,
    });

    const categoryStats: Record<string, EmailStats> = {};

    for (const period of body) {
      for (const stat of period.stats) {
        const category = stat.name;
        
        if (!categoryStats[category]) {
          categoryStats[category] = {
            sent: 0,
            delivered: 0,
            opened: 0,
            clicked: 0,
            bounced: 0,
            spam: 0,
            unsubscribed: 0,
          };
        }
        
        const metrics = stat.metrics;
        categoryStats[category].sent += metrics.requests || 0;
        categoryStats[category].delivered += metrics.delivered || 0;
        categoryStats[category].opened += metrics.opens || 0;
        categoryStats[category].clicked += metrics.clicks || 0;
        categoryStats[category].bounced += metrics.bounces || 0;
        categoryStats[category].spam += metrics.spam_reports || 0;
        categoryStats[category].unsubscribed += metrics.unsubscribes || 0;
      }
    }

    log('stats.category.success', { categories: Object.keys(categoryStats) });
    return categoryStats;
  } catch (error) {
    log('stats.category.error', error);
    throw handleSendGridError(error);
  }
}

/**
 * Get email activity for a specific email
 */
export async function getEmailActivity(
  email: string,
  limit: number = 100
): Promise<any[]> {
  log('stats.activity.start', { email, limit });

  try {
    const client = getSendGridClient();
    
    const queryParams = {
      query: `to_email="${email}"`,
      limit,
    };

    const [response, body] = await client.request({
      method: 'GET',
      url: '/v3/messages',
      qs: queryParams,
    });

    log('stats.activity.success', { email, count: body.messages?.length || 0 });
    return body.messages || [];
  } catch (error) {
    log('stats.activity.error', error);
    throw handleSendGridError(error);
  }
}