/* eslint-disable @typescript-eslint/no-explicit-any */

export async function fetchYoutubeAnalytics(accessToken: string) {
    const response = await fetch(
        "https://www.googleapis.com/youtube/v3/channels?part=statistics&mine=true",
        {
            headers: { Authorization: `Bearer ${accessToken}` },
        }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "Failed to fetch YouTube analytics");

    const stats = data.items?.[0]?.statistics;
    return {
        followers: parseInt(stats?.subscriberCount || "0"),
        impressions: 0,
        engagements: parseInt(stats?.viewCount || "0"),
    };
}
