# Subprocessors List / Liste des sous-traitants

*Last updated: December 2024 / Dernière mise à jour : Décembre 2024*

---

## English Version

### Overview

This document lists all third-party subprocessors that AI Sales Agent engages to process personal data on behalf of our customers. We commit to updating this list whenever we add or remove subprocessors.

### Notification of Changes

We will notify customers at least 30 days before adding any new subprocessor that will have access to personal data. Customers may object to the addition of new subprocessors as outlined in our Data Processing Agreement (DPA).

### Current Subprocessors

| **Subprocessor** | **Location** | **Purpose** | **Data Processed** | **Security Certifications** |
|------------------|--------------|-------------|-------------------|----------------------------|
| **Amazon Web Services (AWS)** | US, EU, Canada | Cloud infrastructure and data storage | All customer data (encrypted) | SOC 2 Type II, ISO 27001, PCI DSS |
| **Stripe, Inc.** | US, EU | Payment processing and subscription management | Payment information, billing details | PCI DSS Level 1, SOC 1/2 |
| **Twilio SendGrid** | US, EU | Email delivery and transactional emails | Email addresses, email content | SOC 2 Type II, ISO 27001 |
| **OpenAI, L.L.C.** | US | AI processing and content generation | Anonymized prospect data, generated content | SOC 2 Type II |
| **Vercel, Inc.** | Global CDN | Application hosting and edge computing | Application data (cached) | SOC 2 Type II |
| **Cloudflare, Inc.** | Global | CDN, DDoS protection, and security | Traffic data, security logs | SOC 2 Type II, ISO 27001 |
| **Google Cloud Platform** | US, EU | Analytics and monitoring (optional) | Anonymized usage data | SOC 2/3, ISO 27001, PCI DSS |
| **Sentry** | US | Error tracking and monitoring | Error logs, performance metrics | SOC 2 Type II, GDPR compliant |
| **Intercom** | US, EU | Customer support chat (when enabled) | Customer support conversations | SOC 2 Type II, Privacy Shield |
| **Datadog** | US, EU | Infrastructure monitoring | System metrics, logs | SOC 2 Type II, ISO 27001 |

### Infrastructure Subprocessors

These subprocessors provide essential infrastructure but have limited or no access to personal data:

| **Subprocessor** | **Purpose** | **Data Access** |
|------------------|-------------|-----------------|
| **GitHub** | Code repository and CI/CD | No customer data |
| **npm** | Package management | No customer data |
| **Let's Encrypt** | SSL certificates | Domain names only |
| **Docker Hub** | Container registry | No customer data |

### Optional Integrations

These subprocessors are only engaged when customers explicitly enable integrations:

| **Integration** | **Provider** | **Location** | **Purpose** | **Opt-in Required** |
|-----------------|--------------|--------------|-------------|-------------------|
| **HubSpot** | HubSpot, Inc. | US, EU | CRM synchronization | Yes |
| **Salesforce** | Salesforce.com | US, EU | CRM synchronization | Yes |
| **Slack** | Slack Technologies | US | Team notifications | Yes |
| **Microsoft Teams** | Microsoft | Global | Team notifications | Yes |
| **Zapier** | Zapier, Inc. | US | Workflow automation | Yes |
| **Clearbit** | Clearbit, Inc. | US | Data enrichment | Yes |
| **Apollo.io** | Apollo.io | US | Data enrichment | Yes |

### Data Residency Options

Customers can choose their preferred data residency region:

- **United States**: Primary data stored in US-East (Virginia)
- **European Union**: Primary data stored in EU-West (Frankfurt)
- **Canada**: Primary data stored in Canada-Central (Montreal)

### Security Standards

All subprocessors are required to:
- Maintain appropriate security certifications
- Sign data processing agreements
- Implement encryption at rest and in transit
- Provide breach notification within 72 hours
- Allow security audits upon request

### Due Diligence

Before engaging any new subprocessor, we:
- Review security certifications and compliance
- Assess data protection measures
- Verify GDPR/CCPA/PIPEDA compliance
- Execute appropriate data processing agreements
- Conduct risk assessments

### Your Rights

As a customer, you have the right to:
- Object to new subprocessors (30-day notice period)
- Request information about subprocessor security measures
- Audit subprocessor compliance (subject to agreements)
- Terminate service if you object to a critical subprocessor

---

## Version française

### Aperçu

Ce document liste tous les sous-traitants tiers qu'AI Sales Agent engage pour traiter des données personnelles pour le compte de nos clients. Nous nous engageons à mettre à jour cette liste lors de l'ajout ou du retrait de sous-traitants.

### Notification des changements

Nous notifierons les clients au moins 30 jours avant d'ajouter tout nouveau sous-traitant ayant accès aux données personnelles. Les clients peuvent s'opposer à l'ajout de nouveaux sous-traitants conformément à notre Accord de traitement des données (DPA).

### Sous-traitants actuels

| **Sous-traitant** | **Localisation** | **Objectif** | **Données traitées** | **Certifications sécurité** |
|-------------------|------------------|--------------|----------------------|----------------------------|
| **Amazon Web Services (AWS)** | US, UE, Canada | Infrastructure cloud et stockage | Toutes données clients (chiffrées) | SOC 2 Type II, ISO 27001, PCI DSS |
| **Stripe, Inc.** | US, UE | Traitement paiements et abonnements | Informations paiement, facturation | PCI DSS Level 1, SOC 1/2 |
| **Twilio SendGrid** | US, UE | Livraison emails transactionnels | Adresses email, contenu emails | SOC 2 Type II, ISO 27001 |
| **OpenAI, L.L.C.** | US | Traitement IA et génération contenu | Données prospects anonymisées | SOC 2 Type II |
| **Vercel, Inc.** | CDN Global | Hébergement application | Données application (cache) | SOC 2 Type II |
| **Cloudflare, Inc.** | Global | CDN, protection DDoS, sécurité | Données trafic, logs sécurité | SOC 2 Type II, ISO 27001 |
| **Google Cloud Platform** | US, UE | Analyses et surveillance (optionnel) | Données usage anonymisées | SOC 2/3, ISO 27001, PCI DSS |
| **Sentry** | US | Suivi erreurs et surveillance | Logs erreurs, métriques | SOC 2 Type II, conforme RGPD |
| **Intercom** | US, UE | Chat support client (si activé) | Conversations support | SOC 2 Type II, Privacy Shield |
| **Datadog** | US, UE | Surveillance infrastructure | Métriques système, logs | SOC 2 Type II, ISO 27001 |

### Sous-traitants d'infrastructure

Ces sous-traitants fournissent une infrastructure essentielle mais ont un accès limité ou nul aux données personnelles :

| **Sous-traitant** | **Objectif** | **Accès données** |
|-------------------|--------------|-------------------|
| **GitHub** | Dépôt code et CI/CD | Aucune donnée client |
| **npm** | Gestion paquets | Aucune donnée client |
| **Let's Encrypt** | Certificats SSL | Noms domaine seulement |
| **Docker Hub** | Registre conteneurs | Aucune donnée client |

### Intégrations optionnelles

Ces sous-traitants ne sont engagés que lorsque les clients activent explicitement les intégrations :

| **Intégration** | **Fournisseur** | **Localisation** | **Objectif** | **Opt-in requis** |
|-----------------|-----------------|------------------|--------------|-------------------|
| **HubSpot** | HubSpot, Inc. | US, UE | Synchronisation CRM | Oui |
| **Salesforce** | Salesforce.com | US, UE | Synchronisation CRM | Oui |
| **Slack** | Slack Technologies | US | Notifications équipe | Oui |
| **Microsoft Teams** | Microsoft | Global | Notifications équipe | Oui |
| **Zapier** | Zapier, Inc. | US | Automatisation workflow | Oui |
| **Clearbit** | Clearbit, Inc. | US | Enrichissement données | Oui |
| **Apollo.io** | Apollo.io | US | Enrichissement données | Oui |

### Options de résidence des données

Les clients peuvent choisir leur région de résidence préférée :

- **États-Unis** : Données primaires stockées US-Est (Virginie)
- **Union européenne** : Données primaires stockées UE-Ouest (Francfort)
- **Canada** : Données primaires stockées Canada-Central (Montréal)

### Normes de sécurité

Tous les sous-traitants doivent :
- Maintenir des certifications de sécurité appropriées
- Signer des accords de traitement de données
- Implémenter le chiffrement au repos et en transit
- Fournir notification de violation sous 72 heures
- Permettre audits sécurité sur demande

### Diligence raisonnable

Avant d'engager tout nouveau sous-traitant, nous :
- Examinons certifications sécurité et conformité
- Évaluons mesures protection données
- Vérifions conformité RGPD/CCPA/PIPEDA
- Exécutons accords traitement données appropriés
- Effectuons évaluations risques

### Vos droits

En tant que client, vous avez le droit de :
- Vous opposer aux nouveaux sous-traitants (préavis 30 jours)
- Demander informations sur mesures sécurité
- Auditer conformité sous-traitants (selon accords)
- Résilier service si opposition à sous-traitant critique

---

## Contact

For questions about our subprocessors / Pour questions sur nos sous-traitants :  
**Email**: privacy@aisalesagent.com  
**DPO**: dpo@aisalesagent.com