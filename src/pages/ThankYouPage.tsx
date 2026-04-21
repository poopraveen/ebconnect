import Masthead from '../components/Masthead'
import Footer from '../components/Footer'
import BurstBackground from '../components/BurstBackground'

function MailCircleIcon() {
  return (
    <div className="relative shrink-0 size-[60px]">
      <div className="w-[60px] h-[60px] rounded-full bg-[#f0f0f0] flex items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#434343" strokeWidth="1.5">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M22 6L12 13 2 6" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  )
}

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-page-bg relative overflow-hidden">
      <BurstBackground />
      <Masthead />

      <main className="flex flex-col items-center justify-center min-h-screen pt-[70px] pb-[40px] px-4">
        <div className="w-full max-w-[851px] flex flex-col gap-16">

          {/* Hero text */}
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="text-[24px] font-semibold font-sans text-text-primary tracking-[0.36px]">
              Thank you for choosing Singlife
            </h1>
            <p className="text-[14px] font-normal font-sans text-text-primary leading-[1.6]">
              We're processing your application. Once it's completed, we'll send you an email with
              the policy details.
            </p>
          </div>

          {/* Help section */}
          <div className="flex flex-col gap-16">
            {/* Header */}
            <div className="flex flex-col items-center gap-4">
              <h2 className="text-[18px] font-semibold font-sans text-text-primary tracking-[0.27px] text-center">
                We're here to help
              </h2>
              <p className="text-[14px] font-normal font-sans text-text-sub text-center leading-[1.6]">
                Need help with other matters? Get the support you need below.
              </p>
            </div>

            {/* Email contact card */}
            <div className="flex flex-col">
              <div className="bg-white rounded-3xl p-6 flex gap-4 items-start w-full">
                <MailCircleIcon />
                <div className="flex flex-col gap-2 flex-1">
                  <h3 className="text-[18px] font-semibold font-sans text-text-primary tracking-[0.27px]">
                    Email
                  </h3>
                  <a
                    href="mailto:ebh_enquiries@singlife.com"
                    className="text-[14px] font-semibold font-sans text-text-error underline underline-offset-2 decoration-solid leading-[1.6]"
                  >
                    ebh_enquiries@singlife.com
                  </a>
                  <p className="text-[14px] font-normal font-sans text-text-primary leading-[1.6]">
                    Send us any enquiries or feedback. We'll get back to you as soon as possible.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
