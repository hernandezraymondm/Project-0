// "use client";

// import { Button } from "@/components/ui/button";
// import { Loader } from "@/components/ui/loader";
// import ReCAPTCHA from "react-google-recaptcha";
// import { useEffect, useState } from "react";
// import { Countdown } from "../countdown";

// interface ResendCodeProps {
//   email: string;
//   token: string;
//   setError: (error: string | undefined) => void;
// }

// export const ResendCode = ({ email, token, setError }: ResendCodeProps) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [resendEnabled, setResendEnabled] = useState(false);
//   const [showCaptcha, setShowCaptcha] = useState(false);
//   const [resendCount, setResendCount] = useState(120);
//   const [error, setError] = useState<string | undefined>();

//   useEffect(() => {
//     if (error) {
//       setError(error);
//     }
//   }, [error, setError]);

//   return (
//     <div className="w-full flex justify-center">
//       {showCaptcha && (
//         <div className="flex flex-col items-center gap-4">
//           <ReCAPTCHA
//             sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
//             onChange={handleCaptchaSuccess}
//           />
//         </div>
//       )}

//       {!isLoading && resendEnabled && !showCaptcha && (
//         <Button
//           variant="ghost"
//           className="text-md !font-semibold"
//           onClick={() => setShowCaptcha(true)}
//           disabled={isLoading || !resendEnabled}
//         >
//           Resend code
//         </Button>
//       )}

//       {isLoading && !showCaptcha && (
//         <span className="flex gap-4 link text-sm text-accent/50 !font-semibold">
//           <Loader size="sm" />
//         </span>
//       )}

//       {!resendEnabled && !showCaptcha && (
//         <Button
//           variant="ghost"
//           className="text-md !font-semibold"
//           disabled={isLoading || !resendEnabled}
//         >
//           Resend code in
//           <Countdown
//             expiration={resendCount}
//             onComplete={handleResendComplete}
//           />
//         </Button>
//       )}
//     </div>
//   );
// };
