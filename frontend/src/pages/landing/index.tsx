import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="flex h-screen w-screen flex-col bg-stone-100 px-10 py-8">
      <nav className="flex items-center justify-between text-sm">
        <div className="font-semibold">C Chimera</div>
        <div>
          <Button>
            <a href="/login">Login</a>
          </Button>
        </div>
      </nav>
      <main className="mt-12 flex items-center justify-center md:mt-20  ">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="">
            <h1 className={`text-4xl font-bold sm:text-6xl lg:text-7xl`}>
              The future of <br />
              file storage
              <br /> is intelligent.
            </h1>
            <p className="mt-4 max-w-xl text-xs font-semibold sm:text-sm md:text-base lg:mt-10 lg:max-w-2xl ">
              No more time wasted searching gain valuable insights into your
              data and free yourself to focus on what's important. Sign up now
              for your free account and experience the future of file storage!
            </p>
            <div className="mt-8 flex lg:mt-10">
              <Button>Get Started</Button>
              <Button
                variant="secondary"
                className="ml-4 bg-stone-200 hover:bg-stone-300"
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className="mx-auto hidden lg:block">
            <img
              src="/images/hero-image.png"
              alt="hero"
              width={400}
              height={300}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
