import { About } from "@/components/home/About";
import { Contact } from "@/components/home/Contact";
import { Hero } from "@/components/home/Hero";
import { Portfolio } from "@/components/home/Portfolio";
import { sanityFetch } from "@/sanity/fetch";
import { CASES_QUERY } from "@/sanity/queries";

export default async function Home() {
  const cases = await sanityFetch({ query: CASES_QUERY });
  const featured = cases.filter((item) => item.featured);

  return (
    <main>
      <Hero />
      <About />
      <Portfolio cases={featured.length > 0 ? featured : cases} />
      <Contact />
    </main>
  );
}
