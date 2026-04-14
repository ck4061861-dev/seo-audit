import React from 'react';

export default function About() {
  return (
    <div className="bg-white text-[#111827] min-h-screen font-['Lexend']">

      <section className="pt-28 pb-12 px-[5%]">
        <div className="max-w-[98%] mx-auto">
          <span className="inline-flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 text-xs text-gray-500 mb-7">
            <span className="w-2 h-2 rounded-full bg-[#a90006] animate-pulse" />
            Powered by BUIMB Digital Research
          </span>
          <h1 className="font-[Syne] font-extrabold text-[clamp(2.8rem,6vw,5rem)] leading-[1.08] mb-6">We Just Don't <em className="font-normal text-[#a90006]">Audit</em> Sites, We <span className="text-[#a90006]">help</span> them Grow.</h1>
          <p className="text-[#7a7f90] text-lg leading-7 max-w-[920px] mb-10">
            SEOAuditor is built on the research-driven philosophy of <strong>BUIMB Digital</strong> — a performance-focused agency trusted by brands worldwide. Every audit is backed by real strategy, not just numbers.
          </p>
          <div className="flex flex-wrap gap-4 mb-12">
            <a href="/" className="bg-[#a90006] text-white font-[Syne] font-bold px-6 py-3 rounded-lg hover:opacity-90">Run Your Free Audit</a>
            <a href="#story" className="border border-[#1e2128] text-[#a90006] px-6 py-3 rounded-lg hover:border-[#a90006]">About Us</a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-[#7a7f90]">
            {['9,500+ Businesses Audited', '4.9★ Client Rating', '100% Client Retention', '12+ Countries Served'].map((item) => (
              <div key={item}>
                <div className="font-[Syne] font-extrabold text-2xl text-[#a90006]">{item.split(' ')[0]}</div>
                <div className="text-sm">{item.replace(item.split(' ')[0], '').trim()}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="story" className="py-20 px-[5%]">
        <div className="max-w-[980px] mx-auto grid lg:grid-cols-2 gap-10">
          <div>
            <span className="text-[#a90006] text-xs uppercase tracking-widest mb-3 inline-block">Our Story</span>
            <h2 className="font-[Syne] font-extrabold text-[clamp(1.9rem,3.5vw,2.8rem)] mb-6">Born from <em className="text-[#a90006]">Research</em>, Built for Results.</h2>
            <p className="text-[#7a7f90] mb-4">SEOAuditor is an initiative of <strong>BUIMB Digital</strong>—a research-driven agency. We believe most tools show data but few tell you <strong>what to do with it</strong>.</p>
            <p className="text-[#7a7f90] mb-4">We built SEOAuditor to change that. Each audit combines technical analysis with the same strategy used by BUIMB Digital — across SEO, AEO, GEO and performance marketing.</p>
            <p className="text-[#7a7f90] mb-6">Startups to enterprises get the same insight that global brands pay premium for. Clear. Actionable. Data-backed.</p>
            <a href="https://buimbdigital.com" target="_blank" rel="noreferrer" className="text-[#a90006] font-[Syne] font-semibold">Visit BUIMB Digital →</a>
          </div>
          <div className="bg-[#fae9ea] border border-[#1e2128] rounded-2xl p-8">
            <p className="text-[#000000] text-xs uppercase tracking-widest mb-4">What BUIMB Stands For</p>
            <ul className="space-y-4">
              {[
                ['B', 'Brand Building & Growth', 'Powerful brand strategy with global appeal.'],
                ['U', 'Unique Innovation', 'Creative, differentiated campaign strategy.'],
                ['I', 'In-depth Research', 'Data-first decisions on every campaign.'],
                ['M', 'Marketing, Business & Robotics', 'Automation meets ROI-focused marketing.'],
                ['B', 'Breakthrough Results', 'Revenue-based performance goals.'],
              ].map(([letter, title, desc]) => (
                <li key={title} className="flex items-start gap-3 border-b border-[#1e2128] pb-3">
                  <div className="font-[Syne] font-black text-xl text-[#a90006]">{letter}</div>
                  <div>
                    <div className="font-semibold text-[#000000]">{title}</div>
                    <div className="text-[#7a7f90] text-sm">{desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-20 px-[5%] bg-[#f9f9f9] border-t border-b border-[#1e2128]">
        <div className="max-w-[980px] mx-auto grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            ['Technical SEO Coverage', '97%'],
            ['AEO Audit Accuracy', '94%'],
            ['GEO Readiness', '89%'],
            ['Client Satisfaction', '4.9/5'],
          ].map(([title, value]) => (
            <div key={title} className="bg-[#aa0101] border border-[#1e2128] rounded-2xl p-5">
              <div className="text-[#ffffff] uppercase tracking-widest text-xs mb-2">{title}</div>
              <div className="font-[Syne] font-bold text-4xl text-[#fdfdfd]">{value}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-[5%]">
        <div className="max-w-[980px] mx-auto">
          <h2 className="font-[Syne] font-extrabold text-[clamp(1.8rem,3vw,2.3rem)] mb-4">Built by specialists, for every business.</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              ['Strategy Team', 'Research-driven SEO & growth planners'],
              ['Tech Team', 'SEO engineers & performance architects'],
              ['Content Team', 'AEO and content strategy specialists'],
              ['Analytics Team', 'Data analysts and execution support'],
            ].map(([title, subtitle]) => (
              <div key={title} className="bg-[#ae0101] border border-[#1e2128] rounded-2xl p-6">
                <div className="text-2xl mb-4">🚀</div>
                <h3 className="font-[Syne] font-bold text-[#ffffff] mb-2">{title}</h3>
                <p className="text-[#ffffff] text-sm">{subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-[5%]      border-t border-b border-[#1e2128] text-center rounded-t-[30px] rounded-b-[30px]">
        <h2 className="font-[Syne] font-extrabold text-3xl mb-3">Ready to uncover what’s holding your site back?</h2>
        <p className="text-[#7a7f90] mb-6">Run a free audit in under 60 seconds and get a full report backed by BUIMB Digital’s research methodology.</p>
        <a href="/" className="bg-[#a90006] text-white font-[Syne] font-bold px-6 py-3 rounded-lg hover:opacity-90">Start Your Free Audit</a>
        <a href="/contact" className="border border-[#1e2128] text-[#a90006] px-6 py-3 rounded-lg ml-4">Contact BUIMB Digital</a>
      </section>
    </div>
  );
}
