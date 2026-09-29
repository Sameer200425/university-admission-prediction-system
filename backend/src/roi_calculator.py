"""
Return on Investment (ROI) Calculator Engine.
Compares total degree investment (tuition + accommodation) against expected
placement package compensation to compute breakeven tenure and 5-year returns.
"""

from typing import Any, Dict, Optional


def calculate_college_roi(
    *,
    annual_tuition_fee: float,
    annual_hostel_fee: float = 0.0,
    annual_misc_fee: float = 15000.0,
    avg_placement_package_lpa: float,
    scholarship_waiver_per_year: float = 0.0,
    course_duration_years: int = 4
) -> Dict[str, Any]:
    """
    Computes mathematical return on investment as specified in Document 2 and Slide 7.
    """
    effective_annual_tuition = max(0.0, annual_tuition_fee - scholarship_waiver_per_year)
    annual_total_cost = effective_annual_tuition + annual_hostel_fee + annual_misc_fee
    total_4yr_investment = annual_total_cost * course_duration_years

    # Placement Package in Rupees
    annual_ctc_inr = avg_placement_package_lpa * 100000.0
    
    # Net annual disposable savings rate estimate (typically ~65-70% of CTC)
    net_annual_savings = annual_ctc_inr * 0.70

    if net_annual_savings > 0:
        breakeven_years = round(total_4yr_investment / net_annual_savings, 2)
    else:
        breakeven_years = 99.0

    # 5-Year Gross Earnings after graduation
    five_year_gross_earnings = annual_ctc_inr * 5.0
    five_year_net_return = five_year_gross_earnings - total_4yr_investment

    if total_4yr_investment > 0:
        roi_percentage = round((five_year_net_return / total_4yr_investment) * 100.0, 1)
    else:
        roi_percentage = 999.0

    # Qualitative Rating
    if roi_percentage >= 300:
        rating = "Exceptional Return (Tier 1 Value)"
        badge_color = "emerald"
    elif roi_percentage >= 150:
        rating = "Strong Return (High Value)"
        badge_color = "teal"
    elif roi_percentage >= 50:
        rating = "Moderate Return (Standard Value)"
        badge_color = "amber"
    else:
        rating = "Low Return (Long Recovery)"
        badge_color = "rose"

    return {
        "annual_breakdown": {
            "tuition_fee": annual_tuition_fee,
            "scholarship_deduction": scholarship_waiver_per_year,
            "effective_tuition": effective_annual_tuition,
            "hostel_living_fee": annual_hostel_fee,
            "miscellaneous_fee": annual_misc_fee,
            "annual_total": annual_total_cost
        },
        "total_4yr_investment": round(total_4yr_investment, 2),
        "total_4yr_investment_formatted": f"₹{total_4yr_investment:,.0f}",
        "avg_placement_package_lpa": avg_placement_package_lpa,
        "annual_starting_ctc_formatted": f"₹{annual_ctc_inr:,.0f}",
        "breakeven_years": breakeven_years,
        "five_year_gross_earnings": round(five_year_gross_earnings, 2),
        "five_year_gross_earnings_formatted": f"₹{five_year_gross_earnings:,.0f}",
        "five_year_net_return": round(five_year_net_return, 2),
        "five_year_net_return_formatted": f"₹{five_year_net_return:,.0f}",
        "roi_percentage": roi_percentage,
        "five_year_roi_percentage": roi_percentage,
        "roi_rating": rating,
        "badge_color": badge_color
    }
