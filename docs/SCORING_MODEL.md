# Smart Business Solution Engine: Opportunity Scoring Model

To transition from generic recommendations to a high-trust intelligence platform, every automation and agent opportunity is evaluated through a rigorous dual-axis scoring model. This guarantees solutions map appropriately to a company's reality.

## 1. Value Matrix (Impact)
Calculated out of 100 points. The weights dynamically shift based on the organization's `scale` or `industry` (e.g., Enterprise weighs strategic leverage heavily; Startups weigh time savings heavily).

* **Revenue Impact (1-10)**: Direct ability to unblock or generate revenue.
* **Cost Reduction (1-10)**: Direct reduction in opex, tool consolidation, or headcount avoidance.
* **Time Savings (1-10)**: Hours reclaimed for higher-leverage work.
* **Customer Experience (CX) Improvement (1-10)**: Impact on retention, NPS, and service delivery.
* **Strategic Leverage (1-10)**: How well this builds a moat or enables future scale.

*Default Weighting Example*: 
`(Rev * 0.3) + (Cost * 0.2) + (Time * 0.25) + (CX * 0.15) + (Strategic * 0.1) = Raw Value` (Scaled to 100)

## 2. Friction Matrix (Complexity)
Calculated out of 100 points. Represents the total organizational drag required to build and maintain the solution.

* **Complexity (1-10)**: Technical difficulty (e.g., legacy AS400 integration vs. modern API).
* **Ease of Implementation (1-10)**: Time-to-value constraint (inverse effect on friction — lower ease = higher friction).
* **Maintenance Burden (1-10)**: Ongoing operational cost (API breakage risk, monitoring needs).
* **Risk Reduction vs. Creation (1-10)**: Security, compliance, or hallucination risk (e.g., automated money movement).

*Default Weighting Example*:
`(Complexity * 0.4) + ((10 - Ease) * 0.3) + (Maintenance * 0.2) + (Risk * 0.1) = Raw Friction` (Scaled to 100)

## 3. The Prioritization Quadrants
Opportunities are mapped onto a 2x2 matrix using Total Value (Y-Axis) and Total Friction (X-Axis).

| Quadrant | Value Score | Friction Score | Classification | Action Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **Q1 (Top Left)** | High (> 60) | Low (< 40) | **Can do now** | Immediate deployment. These are quick wins with high leverage and low integration debt. |
| **Q2 (Top Right)** | High (> 60) | High (>= 40) | **Requires infrastructure first** | High yield, but requires foundational data pipelines or heavy integration. Add to Phase 2/3 Roadmap. |
| **Q3 (Bottom Left)** | Low (<= 60) | Low (< 40) | **Should do next** | Low effort padding. Good for filling sprints or training teams on new AI tools. |
| **Q4 (Bottom Right)** | Low (<= 60) | High (>= 40) | **Not worth doing yet** | Do not deploy. High distraction risk with low return on investment. |
