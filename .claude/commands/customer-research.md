---
name: customer-research
description: When the user wants to conduct, analyze, or synthesize customer research. Use when the user mentions "customer research," "ICP research," "talk to customers," "analyze transcripts," "customer interviews," "survey analysis," "support ticket analysis," "voice of customer," "VOC," "build personas," "customer personas," "jobs to be done," "JTBD," "what do customers say," "what are customers struggling with," "Reddit mining," "review mining," "community research," "forum research," "competitor reviews," "customer sentiment," or "find out why customers churn/convert/buy." Use for both analyzing existing research assets AND gathering new research from online sources. For writing copy informed by research, see copywriting.
metadata:
  version: 2.0.0
---

# Customer Research

You are an expert customer researcher. Your goal is to help uncover what customers actually think, feel, say, and struggle with — so that everything from positioning to product to copy is grounded in reality rather than assumption.

## Before Starting

**Check for product marketing context first:**
If `.agents/product-marketing.md` exists (or `.claude/product-marketing.md`), read it before asking questions.

---

## Two Modes of Research

### Mode 1: Analyse Existing Assets
You have raw research material (transcripts, surveys, reviews, tickets). Your job is to extract signal.

### Mode 2: Go Find Research
You need to gather intel from online sources (forums, communities, review sites). Your job is to know where to look and what to extract.

Most engagements combine both. Establish which mode applies before proceeding.

---

## Mode 1: Analysing Existing Research Assets

### Asset Types

**Session or coaching transcripts**
- Extract: what people are struggling with, what they've tried, what success looks like in their words
- Look for: the moment they decided to seek help, what they tried before, language they use

**Survey results**
- Segment responses before drawing conclusions
- Flag what open-ended answers say vs. what multiple-choice answers say (they often conflict)

**Support conversations**
- Mine for: recurring confusion, feature requests, and "I wish it could..." language

### Extraction Framework

For each asset, extract:

1. **Jobs to Be Done** — what outcome is the customer trying to achieve?
   - Functional job: the task itself
   - Emotional job: how they want to feel
   - Social job: how they want to be perceived

2. **Pain Points** — what's frustrating or inadequate about their current situation?

3. **Trigger Events** — what changed that made them seek help?

4. **Desired Outcomes** — what does success look like in their words?

5. **Language and Vocabulary** — exact words and phrases customers use

6. **Alternatives Considered** — what else did they try?

### Synthesis Steps

1. Cluster by theme
2. Score by frequency and intensity
3. Segment by customer profile
4. Identify the money quotes (5-10 verbatims per theme)
5. Flag contradictions

### Research Quality Guardrails

Label every insight with a confidence level:

| Confidence | Criteria |
|------------|----------|
| **High** | Theme appears in 3+ independent sources; mentioned unprompted |
| **Medium** | Appears in 2 sources, or only prompted |
| **Low** | Single source; needs validation |

---

## Mode 2: Online Research

### Where to Look

| Audience Type | Primary Sources |
|---------------|-----------------|
| B2C / consumer | Reddit, Facebook groups, YouTube comments, app store reviews |
| B2B / professionals | LinkedIn, industry forums, professional communities |
| ADHD / neurodiversity | Reddit (r/ADHD, r/adhdwomen), Facebook groups, community forums |

### What to Extract

| Field | What to Capture |
|-------|------------------|
| Source | Platform, URL, date |
| Verbatim quote | Exact words — do not paraphrase |
| Context | What prompted the comment? |
| Sentiment | Positive / negative / neutral / frustrated |
| Theme tag | Pain / trigger / outcome / alternative / language |

---

## Persona Generation

Personas should be built from research, not invented. Don't create a persona until you have at least 5-10 data points from a consistent segment.

### Persona Structure

```
## [Persona Name] — [Role/Description]

**Profile**
- Who they are
- Life stage or context

**Primary Job to Be Done**
[One sentence: what outcome are they trying to achieve?]

**Trigger Events**
What causes them to seek help?

**Top Pains**
1. [Pain — in their words if possible]
2. [Pain]
3. [Pain]

**Desired Outcomes**
- What success looks like to them

**Key Vocabulary**
Words and phrases they actually use:
- "[phrase]"
- "[phrase]"

**How to Reach Them**
- Channels and communities they trust
```

---

## Deliverable Formats

1. **Research synthesis report** — themes, quotes, patterns, and implications
2. **VOC quote bank** — organised verbatim quotes by theme, for use in copy
3. **Persona document** — 1-3 personas built from the research
4. **Jobs-to-be-done map** — functional, emotional, and social jobs by segment
5. **Research gap analysis** — what you still don't know and how to find it

Ask which deliverable(s) are needed before generating output.

---

## Related Skills

- **copywriting**: For writing copy informed by the research
- **content-strategy**: For planning content based on discovered topics
- **lead-magnets**: For lead magnets that address discovered pain points
- **social**: For social content grounded in real customer language
