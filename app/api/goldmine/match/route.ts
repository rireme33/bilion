import { NextResponse } from "next/server";
import signalsRaw from "@/data/goldmine_signals.json";

type GoldmineSignal = {
  id?: string;
  buyer?: string;
  pain?: string;
  bad_workaround?: string;
  product_angle?: string;
  why_money?: string;
  mvp?: string;
  price_signal?: string;
  nocode_prompt?: string;
  codex_prompt?: string;
  validation_48h?: string;
  score?: number;
};

const signals = signalsRaw as GoldmineSignal[];

function pickFreeSignal(signal: GoldmineSignal) {
  return {
    id: signal.id ?? "",
    product_angle: signal.product_angle ?? "",
    buyer: signal.buyer ?? "",
    pain: signal.pain ?? "",
    bad_workaround: signal.bad_workaround ?? "",
    mvp: signal.mvp ?? "",
    why_money: signal.why_money ?? "",
    price_signal: signal.price_signal ?? "",
    score: typeof signal.score === "number" ? signal.score : 0,

    locked: {
      lovable_prompt: true,
      codex_prompt: true,
      landing_page_copy: true,
      pricing_details: true,
      x_launch_posts: true,
      dm_script: true,
      validation_48h_plan: true,
      first_customer_target: true,
      similar_successful_examples: true,
    },
  };
}

export async function GET() {
  try {
    if (!Array.isArray(signals) || signals.length === 0) {
      return NextResponse.json(
        { error: "No goldmine signals found." },
        { status: 404 }
      );
    }

    const usableSignals = signals.filter((signal) => {
      return (
        signal.product_angle &&
        signal.buyer &&
        signal.pain &&
        signal.mvp &&
        signal.why_money
      );
    });

    if (usableSignals.length === 0) {
      return NextResponse.json(
        { error: "No usable free signals found." },
        { status: 404 }
      );
    }

    const picked =
      usableSignals[Math.floor(Math.random() * usableSignals.length)];

    return NextResponse.json({
      signal: pickFreeSignal(picked),
    });
  } catch (error) {
    console.error("Failed to load goldmine signal:", error);

    return NextResponse.json(
      { error: "Failed to load goldmine signal." },
      { status: 500 }
    );
  }
}