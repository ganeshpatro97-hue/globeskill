import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-client';

export interface GamificationStats {
  xp: number;
  level: number;
  levelTitle: string;
  nextLevelXp: number;
  streak: number;
  unlockedBadges: Array<{
    id: string;
    name: string;
    icon: string;
    sdg: string;
    description: string;
  }>;
  leaderboard: Array<{
    rank: number;
    name: string;
    center: string;
    xp: number;
    badgesCount: number;
  }>;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    const stats: GamificationStats = {
      xp: 420,
      level: 3,
      levelTitle: 'Rising AI Builder',
      nextLevelXp: 600,
      streak: 7,
      unlockedBadges: [
        { id: 'b1', name: 'Digital Explorer', icon: '🚀', sdg: 'SDG 4: Quality Education', description: 'Completed first 5 lessons in GlobeSkill' },
        { id: 'b2', name: 'Python Problem Solver', icon: '🐍', sdg: 'SDG 9: Innovation', description: 'Wrote and debugged 10 programs in Sandbox' },
        { id: 'b3', name: 'UN SDG Tech Innovator', icon: '🏆', sdg: 'SDG 8: Decent Work', description: 'Certified Capstone Project Distinction' },
        { id: 'b4', name: '7-Day Streak Master', icon: '🔥', sdg: 'SDG 4: Continuous Learning', description: 'Practiced daily at local rural learning center' },
      ],
      leaderboard: [
        { rank: 1, name: 'Rohit Kumar', center: 'Varanasi Tech Hub', xp: 640, badgesCount: 6 },
        { rank: 2, name: 'Pooja Devi', center: 'Varanasi Tech Hub', xp: 580, badgesCount: 5 },
        { rank: 3, name: 'Ananya Rao', center: 'Kolar Digital Lab', xp: 520, badgesCount: 5 },
        { rank: 4, name: 'Sunita Sharma', center: 'Thanjavur Center', xp: 480, badgesCount: 4 },
        { rank: 5, name: 'Karan Kumar', center: 'Delhi Community Hub', xp: 420, badgesCount: 4 },
        { rank: 6, name: 'Amit Singh', center: 'Pune Rural Cell', xp: 390, badgesCount: 3 },
      ],
    };

    return NextResponse.json({ success: true, stats });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Gamification API error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId, action, points = 25 } = await req.json();

    return NextResponse.json({
      success: true,
      earnedXp: points,
      message: `🎉 Great job! Earned +${points} XP for ${action || 'coding activity'}!`,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Gamification error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
