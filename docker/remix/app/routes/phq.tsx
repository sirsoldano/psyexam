import type { LoaderFunctionArgs, ActionFunctionArgs, MetaFunction,LinksFunction} from "@remix-run/cloudflare";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "心理検査" },
    {
      name: "心理検査",
      content: "web検査",
    },
  ];
};
export const links: LinksFunction = () => [
  {
    rel: 'stylesheet',
    href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
    crossOrigin: 'anonymous',
  },
];

export const handle = {
  scripts: () => [{ 
      src: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js",
      integrity: "sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz",
      crossOrigin: "anonymous",
      preload: true, 
    }]
}

export default function phq() {
  return (
    <div className="container-lg">
    <div className="my-3 px-3">
      <Form method="post">
        <p className="mt-5 mb-3 fs-5">わたしたちは、<ruby>楽<rp>(</rp><rt>たの</rt><rp>)</rp></ruby>しい<ruby>日<rp>(</rp><rt>ひ</rt><rp>)</rp></ruby>ばかりではなく、ちょっとさみしい<ruby>日<rp>(</rp><rt>ひ</rt><rp>)</rp></ruby>も、<ruby>楽<rp>(</rp><rt>たの</rt><rp>)</rp></ruby>しくない<ruby>日<rp>(</rp><rt>ひ</rt><rp>)</rp></ruby>もあります。みなさんが、この<ruby>一週間<rp>(</rp><rt>いっしゅうかん</rt><rp>)</rp></ruby>どんな<ruby>気持<rp>(</rp><rt>きも</rt><rp>)</rp></ruby>ちだったか、「いつもそうだ」、「ときどきそうだ」、「そんなことはない」の<ruby>中<rp>(</rp><rt>なか</rt><rp>)</rp></ruby>で<ruby>最<rp>(</rp><rt>もっと</rt><rp>)</rp></ruby>もよくあてはまる<ruby>数字<rp>(</rp><rt>すうじ</rt><rp>)</rp></ruby>を<ruby>選<rp>(</rp><rt>えら</rt><rp>)</rp></ruby>んでください。
        </p>
        <h6>1. <ruby>楽<rp>(</rp><rt>たの</rt><rp>)</rp></ruby>しみにしていることがたくさんある</h6>
        <div className="d-grid col-12 mx-auto my-4">
          <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
            <input type="radio" className="btn-check" name="depression1" id="depression1_2" value="2" required />
            <label className="btn btn-outline-secondary" htmlFor="depression1_2">2.いつもそうだ</label>
            <input type="radio" className="btn-check" name="depression1" id="depression1_1" value="1" required />
            <label className="btn btn-outline-secondary" htmlFor="depression1_1">1.ときどきそうだ</label>
            <input type="radio" className="btn-check" name="depression1" id="depression1_0" value="0" required />
            <label className="btn btn-outline-secondary" htmlFor="depression1_0">0.そんなことはない</label>
          </div>
        </div>
        <h6>2. <ruby>泣<rp>(</rp><rt>な</rt><rp>)</rp></ruby>きたいような<ruby>気<rp>(</rp><rt>き</rt><rp>)</rp></ruby>がする</h6>
        <div className="d-grid col-12 mx-auto my-4">
          <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
            <input type="radio" className="btn-check" name="depression2" id="depression2_2" value="2" required />
            <label className="btn btn-outline-secondary" htmlFor="depression2_2">2.いつもそうだ</label>
            <input type="radio" className="btn-check" name="depression2" id="depression2_1" value="1" required />
            <label className="btn btn-outline-secondary" htmlFor="depression2_1">1.ときどきそうだ</label>
            <input type="radio" className="btn-check" name="depression2" id="depression2_0" value="0" required />
            <label className="btn btn-outline-secondary" htmlFor="depression2_0">0.そんなことはない</label>
          </div>
        </div>
        <h6>3. <ruby>遊<rp>(</rp><rt>あそ</rt><rp>)</rp></ruby>びに<ruby>出<rp>(</rp><rt>で</rt><rp>)</rp></ruby>かけるのが<ruby>好<rp>(</rp><rt>す</rt><rp>)</rp></ruby>きだ</h6>
        <div className="d-grid col-12 mx-auto my-4">
          <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
            <input type="radio" className="btn-check" name="depression3" id="depression3_2" value="2" required />
            <label className="btn btn-outline-secondary" htmlFor="depression3_2">2.いつもそうだ</label>
            <input type="radio" className="btn-check" name="depression3" id="depression3_1" value="1" required />
            <label className="btn btn-outline-secondary" htmlFor="depression3_1">1.ときどきそうだ</label>
            <input type="radio" className="btn-check" name="depression3" id="depression3_0" value="0" required />
            <label className="btn btn-outline-secondary" htmlFor="depression3_0">0.そんなことはない</label>
          </div>
        </div>
        <h6>4. <ruby>元気<rp>(</rp><rt>げんき</rt><rp>)</rp></ruby>いっぱいだ</h6>
        <div className="d-grid col-12 mx-auto my-4">
          <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
            <input type="radio" className="btn-check" name="depression4" id="depression4_2" value="2" required />
            <label className="btn btn-outline-secondary" htmlFor="depression4_2">2.いつもそうだ</label>
            <input type="radio" className="btn-check" name="depression4" id="depression4_1" value="1" required />
            <label className="btn btn-outline-secondary" htmlFor="depression4_1">1.ときどきそうだ</label>
            <input type="radio" className="btn-check" name="depression4" id="depression4_0" value="0" required />
            <label className="btn btn-outline-secondary" htmlFor="depression4_0">0.そんなことはない</label>
          </div>
        </div>
        <h6>5. <ruby>生<rp>(</rp><rt>い</rt><rp>)</rp></ruby>きていても<ruby>仕方<rp>(</rp><rt>しかた</rt><rp>)</rp></ruby>がないと<ruby>思<rp>(</rp><rt>おも</rt><rp>)</rp></ruby>う</h6>
        <div className="d-grid col-12 mx-auto my-4">
          <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
            <input type="radio" className="btn-check" name="depression5" id="depression5_2" value="2" required />
            <label className="btn btn-outline-secondary" htmlFor="depression5_2">2.いつもそうだ</label>
            <input type="radio" className="btn-check" name="depression5" id="depression5_1" value="1" required />
            <label className="btn btn-outline-secondary" htmlFor="depression5_1">1.ときどきそうだ</label>
            <input type="radio" className="btn-check" name="depression5" id="depression5_0" value="0" required />
            <label className="btn btn-outline-secondary" htmlFor="depression5_0">0.そんなことはない</label>
          </div>
        </div>
        <div className="d-grid col-12 mx-auto my-5" id="submit">
          <button type="submit" className="btn btn-primary btn-lg"><ruby>提出<rp>(</rp><rt>ていしゅつ</rt><rp>)</rp></ruby>する</button>
        </div>
        <div id="swait" className="text-center d-none"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>
      </Form>
    </div>
    <footer className="d-flex flex-wrap justify-content-between align-items-center py-1 my-4 border-top">
      <div className="col-md-4"></div>
      <p className="col-md-4 mb-0 text-body-secondary text-center">© Kanazawa University</p>
      <div className="col-md-4"></div>
    </footer>
  </div>
  );
}
