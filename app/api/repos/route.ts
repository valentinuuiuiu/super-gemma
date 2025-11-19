import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

export async function GET(request: NextRequest) {
  try {
    // Live repos from your account
    const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
      type: 'owner',
      per_page: 50,
      sort: 'updated'
    });

    // Trending public repos
    const { data: trending } = await octokit.rest.search.repos({
      q: 'stars:>100 created:>2025-11-01',
      sort: 'stars',
      order: 'desc',
      per_page: 10
    });

    return NextResponse.json({
      your_repos: repos.filter(r => !r.fork).map(r => ({
        name: r.name,
        stars: r.stargazers_count,
        description: r.description,
        url: r.html_url,
        updated: r.updated_at
      })),
      trending: trending.items.slice(0, 8).map(r => ({
        name: r.full_name,
        stars: r.stargazers_count,
        description: r.description,
        url: r.html_url
      })),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ error: 'API Error', details: error }, { status: 500 });
  }
}
