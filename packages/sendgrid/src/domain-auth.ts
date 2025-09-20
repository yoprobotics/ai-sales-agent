/**
 * SendGrid Domain Authentication Module
 * Handles SPF, DKIM, and domain verification
 */

import { getSendGridClient, log } from './client';
import { handleSendGridError } from './errors';

export interface DomainAuthenticationStatus {
  id: number;
  domain: string;
  subdomain?: string;
  username: string;
  valid: boolean;
  legacy: boolean;
  dns: {
    mail_server: DnsRecord;
    subdomain_spf: DnsRecord;
    domain_spf: DnsRecord;
    dkim: DnsRecord;
  };
  lastValidationTime?: Date;
}

export interface DnsRecord {
  valid: boolean;
  type: string;
  host: string;
  data: string;
}

export interface DomainVerificationResult {
  valid: boolean;
  spf: {
    valid: boolean;
    record?: string;
    expected?: string;
  };
  dkim: {
    valid: boolean;
    records?: DnsRecord[];
  };
  validation_results?: {
    mail_server: boolean;
    subdomain_spf: boolean;
    domain_spf: boolean;
    dkim: boolean;
  };
}

/**
 * Authenticate a domain for sending
 */
export async function authenticateDomain(
  domain: string,
  options?: {
    subdomain?: string;
    customSpf?: boolean;
    defaultDkim?: boolean;
    automaticSecurity?: boolean;
    customDkimSelector?: string;
    region?: string;
  }
): Promise<DomainAuthenticationStatus> {
  log('domain.authenticate.start', { domain, options });

  try {
    const client = getSendGridClient();
    
    const body: any = {
      domain,
      subdomain: options?.subdomain || `em${Date.now()}`,
      custom_spf: options?.customSpf || false,
      default: options?.defaultDkim || false,
      automatic_security: options?.automaticSecurity ?? true,
    };

    if (options?.customDkimSelector) {
      body.custom_dkim_selector = options.customDkimSelector;
    }

    if (options?.region) {
      body.region = options.region;
    }

    const [response, authData] = await client.request({
      method: 'POST',
      url: '/v3/whitelabel/domains',
      body
    });

    log('domain.authenticate.success', { 
      domain,
      id: authData.id,
      valid: authData.valid 
    });

    return authData;
  } catch (error) {
    log('domain.authenticate.error', error);
    throw handleSendGridError(error);
  }
}

/**
 * Validate domain authentication
 */
export async function validateDomain(
  domainId: number
): Promise<DomainVerificationResult> {
  log('domain.validate.start', { domainId });

  try {
    const client = getSendGridClient();
    
    const [response, validationData] = await client.request({
      method: 'POST',
      url: `/v3/whitelabel/domains/${domainId}/validate`
    });

    const result: DomainVerificationResult = {
      valid: validationData.valid,
      spf: {
        valid: validationData.validation_results?.subdomain_spf || false,
      },
      dkim: {
        valid: validationData.validation_results?.dkim || false,
      },
      validation_results: validationData.validation_results
    };

    log('domain.validate.success', { 
      domainId,
      valid: result.valid,
      validation: result.validation_results
    });

    return result;
  } catch (error) {
    log('domain.validate.error', error);
    throw handleSendGridError(error);
  }
}

/**
 * Get all authenticated domains
 */
export async function getAuthenticatedDomains(): Promise<DomainAuthenticationStatus[]> {
  log('domain.list.start');

  try {
    const client = getSendGridClient();
    
    const [response, domains] = await client.request({
      method: 'GET',
      url: '/v3/whitelabel/domains'
    });

    log('domain.list.success', { count: domains.length });
    return domains;
  } catch (error) {
    log('domain.list.error', error);
    throw handleSendGridError(error);
  }
}

/**
 * Get a specific authenticated domain
 */
export async function getAuthenticatedDomain(
  domainId: number
): Promise<DomainAuthenticationStatus> {
  log('domain.get.start', { domainId });

  try {
    const client = getSendGridClient();
    
    const [response, domain] = await client.request({
      method: 'GET',
      url: `/v3/whitelabel/domains/${domainId}`
    });

    log('domain.get.success', { 
      domainId,
      domain: domain.domain,
      valid: domain.valid 
    });

    return domain;
  } catch (error) {
    log('domain.get.error', error);
    throw handleSendGridError(error);
  }
}

/**
 * Delete an authenticated domain
 */
export async function deleteAuthenticatedDomain(
  domainId: number
): Promise<void> {
  log('domain.delete.start', { domainId });

  try {
    const client = getSendGridClient();
    
    await client.request({
      method: 'DELETE',
      url: `/v3/whitelabel/domains/${domainId}`
    });

    log('domain.delete.success', { domainId });
  } catch (error) {
    log('domain.delete.error', error);
    throw handleSendGridError(error);
  }
}

/**
 * Get DNS records for domain authentication
 */
export async function getDnsRecords(
  domainId: number
): Promise<DnsRecord[]> {
  log('domain.dns.start', { domainId });

  try {
    const domain = await getAuthenticatedDomain(domainId);
    
    const records: DnsRecord[] = [];
    
    // Add SPF records
    if (domain.dns.subdomain_spf) {
      records.push(domain.dns.subdomain_spf);
    }
    if (domain.dns.domain_spf) {
      records.push(domain.dns.domain_spf);
    }
    
    // Add DKIM record
    if (domain.dns.dkim) {
      records.push(domain.dns.dkim);
    }
    
    // Add mail server record
    if (domain.dns.mail_server) {
      records.push(domain.dns.mail_server);
    }

    log('domain.dns.success', { 
      domainId,
      recordCount: records.length 
    });

    return records;
  } catch (error) {
    log('domain.dns.error', error);
    throw handleSendGridError(error);
  }
}

/**
 * Instructions for setting up DNS records
 */
export function getDnsInstructions(): {
  spf: string;
  dkim: string;
  dmarc: string;
} {
  return {
    spf: `
SPF (Sender Policy Framework) Setup:
1. Add a TXT record to your domain's DNS
2. Host: @ or your domain
3. Value: "v=spf1 include:sendgrid.net ~all"
4. If you already have an SPF record, add "include:sendgrid.net" to it
5. Wait 24-48 hours for DNS propagation

Example combined SPF record:
"v=spf1 include:sendgrid.net include:_spf.google.com ~all"
    `.trim(),
    
    dkim: `
DKIM (DomainKeys Identified Mail) Setup:
1. SendGrid will provide 2 CNAME records
2. Add these CNAME records to your domain's DNS
3. Host: s1._domainkey.yourdomain.com
   Points to: s1.domainkey.u[XXXXX].wl[XXX].sendgrid.net
4. Host: s2._domainkey.yourdomain.com
   Points to: s2.domainkey.u[XXXXX].wl[XXX].sendgrid.net
5. Wait 24-48 hours for DNS propagation
6. Validate in SendGrid dashboard
    `.trim(),
    
    dmarc: `
DMARC (Domain-based Message Authentication) Setup (Recommended):
1. Add a TXT record to your domain's DNS
2. Host: _dmarc.yourdomain.com
3. Value: "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com; pct=100"
4. Start with p=none for monitoring, then move to p=quarantine or p=reject
5. Monitor DMARC reports at the specified email address

Policies:
- p=none: Monitor only
- p=quarantine: Send suspicious emails to spam
- p=reject: Block suspicious emails
    `.trim()
  };
}

/**
 * Check if a domain is properly configured
 */
export async function isDomainConfigured(
  domain: string
): Promise<boolean> {
  log('domain.check.start', { domain });

  try {
    const domains = await getAuthenticatedDomains();
    
    const domainAuth = domains.find(d => 
      d.domain === domain && d.valid
    );
    
    const isConfigured = !!domainAuth;
    
    log('domain.check.result', { 
      domain,
      configured: isConfigured 
    });
    
    return isConfigured;
  } catch (error) {
    log('domain.check.error', error);
    return false;
  }
}

/**
 * Wait for domain validation
 */
export async function waitForDomainValidation(
  domainId: number,
  maxAttempts: number = 10,
  intervalMs: number = 30000
): Promise<boolean> {
  log('domain.wait.start', { 
    domainId,
    maxAttempts,
    intervalMs 
  });

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const result = await validateDomain(domainId);
    
    if (result.valid) {
      log('domain.wait.success', { 
        domainId,
        attempts: attempt 
      });
      return true;
    }
    
    log('domain.wait.attempt', { 
      domainId,
      attempt,
      maxAttempts 
    });
    
    if (attempt < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }
  }
  
  log('domain.wait.timeout', { 
    domainId,
    maxAttempts 
  });
  
  return false;
}

/**
 * Generate domain setup report
 */
export async function generateDomainReport(
  domain: string
): Promise<{
  configured: boolean;
  spf: { status: string; message: string };
  dkim: { status: string; message: string };
  recommendations: string[];
}> {
  try {
    const domains = await getAuthenticatedDomains();
    const domainAuth = domains.find(d => d.domain === domain);
    
    if (!domainAuth) {
      return {
        configured: false,
        spf: { 
          status: '❌ Not configured',
          message: 'Domain authentication not set up in SendGrid'
        },
        dkim: { 
          status: '❌ Not configured',
          message: 'DKIM records not configured'
        },
        recommendations: [
          'Set up domain authentication in SendGrid',
          'Add SPF records to DNS',
          'Configure DKIM records',
          'Consider adding DMARC policy'
        ]
      };
    }
    
    const validation = await validateDomain(domainAuth.id);
    
    return {
      configured: validation.valid,
      spf: {
        status: validation.spf.valid ? '✅ Valid' : '⚠️ Invalid',
        message: validation.spf.valid 
          ? 'SPF records correctly configured'
          : 'SPF records need to be updated in DNS'
      },
      dkim: {
        status: validation.dkim.valid ? '✅ Valid' : '⚠️ Invalid',
        message: validation.dkim.valid
          ? 'DKIM records correctly configured'
          : 'DKIM records need to be updated in DNS'
      },
      recommendations: [
        ...(validation.spf.valid ? [] : ['Update SPF records in DNS']),
        ...(validation.dkim.valid ? [] : ['Update DKIM records in DNS']),
        'Monitor email deliverability',
        'Set up DMARC policy for additional protection'
      ]
    };
  } catch (error) {
    log('domain.report.error', error);
    throw error;
  }
}
