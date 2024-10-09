import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

async function getMoxieUsdPrice() {
  const response = await fetch('https://moxie-stat.vercel.app/api/moxie-price');
  if (!response.ok) {
    console.error('Error fetching Moxie price:', response.statusText);
    return { usdPrice: 0.002713797027076074, usdPriceFormatted: '0.002713797027076074', '24hrPercentChange': '0' };
  }
  return response.json();
}

function parseNumber(value: string): number {
  if (value.endsWith('K')) {
    return parseFloat(value) * 1000;
  } else if (value.endsWith('M')) {
    return parseFloat(value) * 1000000;
  }
  return parseFloat(value);
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  } else {
    return num.toFixed(2);
  }
}

const interBoldFont = fetch(
    new URL('../../assets/Inter-Bold.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer());

const interSemiBoldFont = fetch(
    new URL('../../assets/Inter-SemiBold.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer());

const interExtraBoldFont = fetch(
    new URL('../../assets/Inter-ExtraBold.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer());

const interRegularFont = fetch(
    new URL('../../assets/Inter-Regular.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer());

const jerseyFont = fetch(
    new URL('../../assets/Jersey-Regular.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer());

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const { usdPrice } = await getMoxieUsdPrice();

  const userData = {
    profileImageUrl: searchParams.get('profileImageUrl') || 'https://example.com/default-avatar.png',
    profileDisplayName: searchParams.get('name') || 'User Name',
    username: searchParams.get('username') || 'username',
    socialCapitalScore: searchParams.get('score') || '1000',
    socialCapitalRank: searchParams.get('rank') || '11200',
  };

  const moxieData = {
    today: { 
      allEarningsAmount: searchParams.get('today') || '0',
      usdValue: formatNumber(parseNumber(searchParams.get('today') || '0') * usdPrice)
    },
    weekly: { 
      allEarningsAmount: searchParams.get('weekly') || '0',
      usdValue: formatNumber(parseNumber(searchParams.get('weekly') || '0') * usdPrice)
    },
    lifetime: { 
      allEarningsAmount: searchParams.get('lifetime') || '0',
      usdValue: formatNumber(parseNumber(searchParams.get('lifetime') || '0') * usdPrice)
    },
  };

  const score = parseFloat(userData.socialCapitalScore);
  const engagementData = {
    like: { 
      moxie: formatNumber(score * 0.5), 
      usd: formatNumber(score * 0.5 * usdPrice)
    },
    reply: { 
      moxie: formatNumber(score * 2), 
      usd: formatNumber(score * 2 * usdPrice)
    },
    recast: { 
      moxie: formatNumber(score * 4), 
      usd: formatNumber(score * 4 * usdPrice)
    },
  };
 
  const interBoldFontData = await interBoldFont;
  const interSemiBoldFontData = await interSemiBoldFont;
  const interExtraBoldFontData = await interExtraBoldFont;
  const interRegularFontData = await interRegularFont;
  const jerseyFontData = await jerseyFont;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundImage: "url('https://uqmhcw5knmkdj4wh.public.blob.vercel-storage.com/maxi-dUCgF5LzFt4mAHVwUUESvfSjhmsCT9.png')",
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'jersey',
          fontWeight: '400',
          color: 'white',
          padding: '2rem 3rem',
         
        }}
      >
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.0)' }} />
        
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
          <div style={{ display: 'flex', flex: 1, marginTop: '1rem' }}>
            {/* User Profile */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: '0.5rem', padding: '1rem', backdropFilter: 'blur(4px)', flex: 0.55, marginRight: '3rem', marginLeft: '0.5rem',marginTop: '1rem', border: '1px solid white' }}>
              <img
                src={decodeURIComponent(userData.profileImageUrl)}
                alt={userData.profileDisplayName}
                width="200"
                height="200"
                style={{ width: '7.5rem', height: '7.5rem', borderRadius: '9999px', margin: 0,padding: '1rem'}}
              />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h2 style={{  fontSize: '4rem', fontWeight: '800', margin: 0, textAlign: 'center',textTransform: 'uppercase'}}>{userData.profileDisplayName}</h2>
                <p style={{ fontSize: '2.7rem', color: 'rgb(147, 197, 253)', marginTop: '-0.5rem' }}>@{userData.username}</p>
              </div>
            </div>

            {/* Moxie Earnings */}
            <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.0)', borderRadius: '0.2rem', padding: '1rem', backdropFilter: 'blur(4px)', flex: 1, display: 'flex', flexDirection: 'column' ,paddingBlock: '1rem',margin:0,marginLeft: '0.5rem' }}>
              <h3 style={{ fontSize: '3.5rem', fontWeight: '400', marginBottom: '1rem', marginTop: '0.5rem', justifyContent: 'center', textTransform: 'uppercase' }}>Moxie Earnings</h3>
              <div style={{ display: 'flex', justifyContent: 'center', flex: 1 }}>
                {Object.entries(moxieData).map(([period, { allEarningsAmount, usdValue }]) => (
                  <div key={period} style={{ borderRadius: '1rem', flex: 0.5, margin: 0.5, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', border: '1px', borderColor: 'white' }}>
                    <p style={{ color: '#ffe248',fontSize: '3.5rem', fontWeight: '400', margin: 0}}>{allEarningsAmount}</p>
                    <p style={{ fontSize: '2.5rem', margin: 0 }}>${usdValue}</p>
                    <p style={{ fontSize: '2rem', fontWeight: '400', margin: 0 }}>{period.charAt(0).toUpperCase() + period.slice(1)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flex: 1, margin: '1rem'   }}>
            {/* Fan Score */}
            <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)', borderRadius: '0.5rem', padding: '1rem', backdropFilter: 'blur(4px)', flex: 0.4, marginLeft: '2.2rem',marginRight: '0.5rem', marginTop: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <h3 style={{ fontSize: '3rem', fontWeight: '400', marginBottom: '0.1rem' }}>FAR SCORE</h3>
              <p style={{ color: '#ffe248',fontSize: '5rem', fontWeight: '400', margin: 0 }}>{userData.socialCapitalScore}</p>
              <p style={{ fontSize: '3rem', fontWeight: '400', marginTop: '0.5rem' }}>Rank: {userData.socialCapitalRank}</p>
            </div>

            {/* Engagement Value */}
            <div style={{ backgroundColor: 'rgba(0, 0, 0, 0)', borderRadius: '0.5rem', paddingBottom: '1rem',paddingTop: '0.1rem', backdropFilter: 'blur(4px)', flex: 1, display: 'flex', flexDirection: 'column',marginLeft: '2rem' }}>
              <h3 style={{ fontSize: '3.5rem', fontWeight: '400',marginBottom: '0.2rem',marginLeft: '2.2rem', justifyContent: 'center', textTransform: 'uppercase',paddingBottom: '0.5rem' }}>Your Engagement Value</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', flex: 1 }}>
                {Object.entries(engagementData).map(([action, { moxie, usd }]) => (
                  <div key={action} style={{ marginLeft: '3rem',marginTop: '0.2rem',marginBottom: '0.5rem', backgroundColor: 'rgba(30, 58, 138, 0.0)', borderRadius: '0.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
                    <p style={{ color: '#ffe248',fontSize: '3.5rem', fontWeight: '400', marginTop: '1rem', marginBottom: '1rem' }}>{moxie}</p>
                    <p style={{ fontSize: '2.5rem', marginTop: '0.5rem',marginBottom: '1rem' }}>${usd}</p>
                    <p style={{ fontSize: '2rem', marginTop: '0.3rem',marginBottom: '1rem' }}>{action.charAt(0).toUpperCase() + action.slice(1)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: interBoldFontData,
          weight: 700,
        },
        {
          name: 'Inter',
          data: interSemiBoldFontData,
          weight: 600,
        },
        {
          name: 'Inter',
          data: interExtraBoldFontData,
          weight: 800,
        },
        {
          name: 'Inter',
          data: interRegularFontData,
          weight: 400,
        },
        {
          name: 'Jersey',
          data: jerseyFontData,
          weight: 400,
        },
      ],
    }
  );
}