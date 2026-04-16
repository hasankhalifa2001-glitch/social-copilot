/* eslint-disable @typescript-eslint/no-explicit-any */

export async function fetchLinkedinAnalytics(accessToken: string, personUrn: string) {
    const response = await fetch(
        `https://api.linkedin.com/v2/networkSizes/${personUrn}?edgeType=CompanyFollowedByMember`,
        {
            headers: { Authorization: `Bearer ${accessToken}` },
        }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch LinkedIn analytics");

    return {
        followers: data.firstDegreeSize || 0,
        impressions: 0,
        engagements: 0,
    };
}
