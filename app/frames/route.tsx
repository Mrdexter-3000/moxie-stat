import { Button } from "frames.js/next";
import React from "react";
import { frames } from "./frames";
import { appURL, formatNumber } from "../utils";
import { text } from "stream/consumers";


interface State {
  lastFid?: string;
}

interface MoxieData {
  today: { allEarningsAmount: string };
  weekly: { allEarningsAmount: string };
  lifetime: { allEarningsAmount: string };
}

interface EngagementData {
  like: string;
  reply: string;
  recast: string;
}

const frameHandler = frames(async (ctx) => {
  interface UserData {
    name: string;
    username: string;
    fid: string;
    socialCapitalScore: string;
    socialCapitalRank: string;
    profileDisplayName: string;
    profileImageUrl: string;
  }

  let userData: UserData | null = null;
  let moxieData: MoxieData | null = null;
  

  let error: string | null = null;
  let isLoading = false;

  const fetchUserData = async (fid: string) => {
    isLoading = true;
    try {
      const airstackUrl = `${appURL()}/api/farscore?userId=${encodeURIComponent(
        fid
      )}`;
      const airstackResponse = await fetch(airstackUrl);
      if (!airstackResponse.ok) {
        throw new Error(
          `Airstack HTTP error! status: ${airstackResponse.status}`
        );
      }
      const airstackData = await airstackResponse.json();

      if (
        airstackData.userData.Socials.Social &&
        airstackData.userData.Socials.Social.length > 0
      ) {
        const social = airstackData.userData.Socials.Social[0];
        userData = {
          name: social.profileDisplayName || social.profileName || "Unknown",
          username: social.profileName || "unknown",
          fid: social.userId || "N/A",
          profileDisplayName: social.profileDisplayName || "N/A",
          socialCapitalScore:
            social.socialCapital?.socialCapitalScore?.toFixed(2) || "N/A",
          socialCapitalRank: social.socialCapital?.socialCapitalRank || "N/A",
          profileImageUrl:
            social.profileImageContentValue?.image?.extraSmall ||
            social.profileImage ||
            "",
        };
      } else {
        throw new Error("No user data found");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      error = (err as Error).message;
    } finally {
      isLoading = false;
    }
  };

  const fetchMoxieData = async (fid: string) => {
    try {
      const moxieUrl = `${appURL()}/api/moxie-earnings?entityId=${encodeURIComponent(
        fid
      )}`;
      const moxieResponse = await fetch(moxieUrl);
      if (!moxieResponse.ok) {
        throw new Error(`Moxie HTTP error! status: ${moxieResponse.status}`);
      }
      moxieData = await moxieResponse.json();
    } catch (err) {
      console.error("Error fetching Moxie data:", err);
      error = (err as Error).message;
    }
  };

  const extractFid = (url: string): string | null => {
    try {
      const parsedUrl = new URL(url);
      let fid = parsedUrl.searchParams.get("userfid");

      console.log("Extracted FID from URL:", fid);
      return fid;
    } catch (e) {
      console.error("Error parsing URL:", e);
      return null;
    }
  };

  let fid: string | null = null;

  if (ctx.message?.requesterFid) {
    fid = ctx.message.requesterFid.toString();
    console.log("Using requester FID:", fid);
  } else if (ctx.url) {
    fid = extractFid(ctx.url.toString());
    console.log("Extracted FID from URL:", fid);
  } else {
    console.log("No ctx.url available");
  }

  if (!fid && (ctx.state as State)?.lastFid) {
    fid = (ctx.state as State).lastFid ?? null;
    console.log("Using FID from state:", fid);
  }

  console.log("Final FID used:", fid);

  const shouldFetchData =
    fid && (!userData || (userData as UserData).fid !== fid);

  if (shouldFetchData && fid) {
    await Promise.all([fetchUserData(fid), fetchMoxieData(fid)]);
  }



  const SplashScreen = () => ({
    image: "https://uqmhcw5knmkdj4wh.public.blob.vercel-storage.com/splash-Rdu7ATWoRkov7e7eYcpKORd5vuyCTD.gif",
  });

  const ScoreScreen = () => {
    console.log("Rendering ScoreScreen");
    console.log("userData:", userData);
    console.log("moxieData:", moxieData);

    const ogImageUrl = `${appURL()}/api/og?` + new URLSearchParams({
      name: userData?.profileDisplayName || 'Unknown',
      username: userData?.username || 'unknown',
      score: userData?.socialCapitalScore || 'N/A',
      rank: userData?.socialCapitalRank?.toString() || 'N/A',
      like: userData?.socialCapitalScore || 'N/A',
      reply: (Number(userData?.socialCapitalScore) * 3).toFixed(2),
      recast: (Number(userData?.socialCapitalScore) * 6).toFixed(2),
      today: formatNumber(parseFloat(moxieData?.today.allEarningsAmount || '0')),
      weekly: formatNumber(parseFloat(moxieData?.weekly.allEarningsAmount || '0')),
      lifetime: formatNumber(parseFloat(moxieData?.lifetime.allEarningsAmount || '0')),
      profileImageUrl: encodeURIComponent(userData?.profileImageUrl || ''),
      cache: Date.now().toString(),
    }).toString();

    console.log("OG Image URL:", ogImageUrl);

    return {
      image: ogImageUrl,
    };
  };

  const shareText = encodeURIComponent(
    `🔍 Curious about your Moxie? All stats revealed here! 
    frame by @0xdexter Tip for awesomeness`
  );

  // Change the url here
  const shareUrl = `https://warpcast.com/~/compose?text=${shareText}&embeds[]=https://moxie-stat.vercel.app/frames${
    fid ? `?userfid=${fid}` : ""
  }`;

  const buttons = [];

  if (!userData) {
    buttons.push(
      <Button action="post" target={{ href: `${appURL()}?userfid=${fid}` }}>
        My Stats
      </Button>,
      <Button
        action="link"
        
        target="https://warpcast.com/~/add-cast-action?url=https%3A%2F%2Fmoxie-stat.vercel.app%2Fapi%2Fcast-action"
      >
        Cast Action
      </Button>,
    );
  } else {
    buttons.push(
      <Button action="post" target={{ href: `${appURL()}?userfid=${fid}` }}>
        Refresh
      </Button>,
      <Button action="link" target={shareUrl}>
        Share
      </Button>,
      <Button action="link" target="https://warpcast.com/0xdexter/0xa911067c">
        Tip here
      </Button>
    );
  }

  return {
    ...(fid && !error ? ScoreScreen() : SplashScreen()),
    buttons: buttons,
  };
});

export const GET = frameHandler;
export const POST = frameHandler;