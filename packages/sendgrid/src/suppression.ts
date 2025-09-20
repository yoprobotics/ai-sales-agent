import { getSendGridClient, log } from './client';
import { handleSendGridError } from './errors';
import { SuppressionListEntry } from './types';

/**
 * Add email to suppression list
 */
export async function addToSuppressionList(
  email: string,
  type: 'bounce' | 'spam' | 'unsubscribe' | 'invalid'
): Promise<void> {
  log('suppression.add.start', { email, type });

  try {
    const client = getSendGridClient();
    
    let endpoint = '';
    let data: any = {};

    switch (type) {
      case 'bounce':
        endpoint = '/v3/suppression/bounces';
        data = { email, created_at: Math.floor(Date.now() / 1000) };
        break;
      case 'spam':
        endpoint = '/v3/suppression/spam_reports';
        data = { email, created_at: Math.floor(Date.now() / 1000) };
        break;
      case 'unsubscribe':
        endpoint = '/v3/suppression/unsubscribes';
        data = { email, created_at: Math.floor(Date.now() / 1000) };
        break;
      case 'invalid':
        endpoint = '/v3/suppression/invalid_emails';
        data = { email, created_at: Math.floor(Date.now() / 1000) };
        break;
    }

    await client.request({
      method: 'POST',
      url: endpoint,
      body: data,
    });

    log('suppression.add.success', { email, type });
  } catch (error) {
    log('suppression.add.error', error);
    throw handleSendGridError(error);
  }
}

/**
 * Remove email from suppression list
 */
export async function removeFromSuppressionList(
  email: string,
  type: 'bounce' | 'spam' | 'unsubscribe' | 'invalid'
): Promise<void> {
  log('suppression.remove.start', { email, type });

  try {
    const client = getSendGridClient();
    
    let endpoint = '';

    switch (type) {
      case 'bounce':
        endpoint = `/v3/suppression/bounces/${email}`;
        break;
      case 'spam':
        endpoint = `/v3/suppression/spam_reports/${email}`;
        break;
      case 'unsubscribe':
        endpoint = `/v3/suppression/unsubscribes/${email}`;
        break;
      case 'invalid':
        endpoint = `/v3/suppression/invalid_emails/${email}`;
        break;
    }

    await client.request({
      method: 'DELETE',
      url: endpoint,
    });

    log('suppression.remove.success', { email, type });
  } catch (error: any) {
    if (error.statusCode === 404) {
      log('suppression.remove.not_found', { email, type });
      return;
    }
    
    log('suppression.remove.error', error);
    throw handleSendGridError(error);
  }
}

/**
 * Check if email is in suppression list
 */
export async function isEmailSuppressed(
  email: string,
  type?: 'bounce' | 'spam' | 'unsubscribe' | 'invalid'
): Promise<boolean> {
  log('suppression.check.start', { email, type });

  try {
    const client = getSendGridClient();
    
    const typesToCheck = type ? [type] : ['bounce', 'spam', 'unsubscribe', 'invalid'];
    
    for (const checkType of typesToCheck) {
      let endpoint = '';
      
      switch (checkType) {
        case 'bounce':
          endpoint = `/v3/suppression/bounces/${email}`;
          break;
        case 'spam':
          endpoint = `/v3/suppression/spam_reports/${email}`;
          break;
        case 'unsubscribe':
          endpoint = `/v3/suppression/unsubscribes/${email}`;
          break;
        case 'invalid':
          endpoint = `/v3/suppression/invalid_emails/${email}`;
          break;
      }

      try {
        const [response] = await client.request({
          method: 'GET',
          url: endpoint,
        });
        
        if (response.statusCode === 200) {
          log('suppression.check.found', { email, type: checkType });
          return true;
        }
      } catch (error: any) {
        if (error.statusCode !== 404) {
          throw error;
        }
      }
    }

    log('suppression.check.not_found', { email });
    return false;
  } catch (error) {
    log('suppression.check.error', error);
    throw handleSendGridError(error);
  }
}

/**
 * Get all suppressed emails
 */
export async function getSuppressionList(
  type: 'bounce' | 'spam' | 'unsubscribe' | 'invalid',
  params?: {
    startTime?: Date;
    endTime?: Date;
    limit?: number;
    offset?: number;
  }
): Promise<SuppressionListEntry[]> {
  log('suppression.list.start', { type, params });

  try {
    const client = getSendGridClient();
    
    let endpoint = '';
    
    switch (type) {
      case 'bounce':
        endpoint = '/v3/suppression/bounces';
        break;
      case 'spam':
        endpoint = '/v3/suppression/spam_reports';
        break;
      case 'unsubscribe':
        endpoint = '/v3/suppression/unsubscribes';
        break;
      case 'invalid':
        endpoint = '/v3/suppression/invalid_emails';
        break;
    }

    const queryParams: any = {};
    
    if (params?.startTime) {
      queryParams.start_time = Math.floor(params.startTime.getTime() / 1000);
    }
    
    if (params?.endTime) {
      queryParams.end_time = Math.floor(params.endTime.getTime() / 1000);
    }
    
    if (params?.limit) {
      queryParams.limit = params.limit;
    }
    
    if (params?.offset) {
      queryParams.offset = params.offset;
    }

    const [response, body] = await client.request({
      method: 'GET',
      url: endpoint,
      qs: queryParams,
    });

    const entries: SuppressionListEntry[] = body.map((item: any) => ({
      email: item.email,
      reason: type,
      createdAt: new Date(item.created * 1000),
    }));

    log('suppression.list.success', { type, count: entries.length });
    return entries;
  } catch (error) {
    log('suppression.list.error', error);
    throw handleSendGridError(error);
  }
}

/**
 * Unsubscribe an email globally
 */
export async function unsubscribeEmail(email: string): Promise<void> {
  return addToSuppressionList(email, 'unsubscribe');
}

/**
 * Resubscribe an email
 */
export async function resubscribeEmail(email: string): Promise<void> {
  return removeFromSuppressionList(email, 'unsubscribe');
}