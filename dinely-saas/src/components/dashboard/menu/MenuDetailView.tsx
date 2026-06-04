import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Bookmark,
  MessageCircle,
  Pencil,
  Ribbon,
  Share2,
  Star,
} from "lucide-react";
import type { MenuItem } from "../../../lib/dashboard/mockData";
import { menuItems } from "../../../lib/dashboard/mockData";
import { Button } from "../../ui/Button";
import { DashboardCard } from "../DashboardCard";
import { DashboardPageHeader } from "../DashboardPageHeader";

interface MenuDetailViewProps {
  item: MenuItem;
}

export function MenuDetailView({ item }: MenuDetailViewProps) {
  const similar = menuItems.filter((m) => m.id !== item.id && m.category === item.category).slice(0, 3);
  const fallbackSimilar = menuItems.filter((m) => m.id !== item.id).slice(0, 3);
  const similarItems = similar.length >= 3 ? similar : fallbackSimilar;

  const stats = [
    { icon: Star, label: `${item.rating} Ratings` },
    { icon: MessageCircle, label: `${item.reviews} Reviews` },
    { icon: Pencil, label: `${item.orders} Orders` },
    { icon: Ribbon, label: `${item.favourites} Favourites` },
  ];

  return (
    <>
      <DashboardPageHeader
        title="Menu details"
        description={item.name}
        action={
          <Link
            href="/dashboard/menu"
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200/80 px-4 py-2 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-50"
          >
            <ArrowLeft size={16} />
            Back to menu
          </Link>
        }
      />

      <div className="flex gap-6">
      <div className="min-w-0 flex-1">

        <DashboardCard padding="none" className="overflow-hidden">
          <div className="relative aspect-[21/9] bg-neutral-100">
            <Image src={item.image} alt={item.name} fill className="object-cover" priority sizes="900px" />
          </div>

          <div className="p-6 lg:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">{item.name}</h1>
                <p className="mt-1 text-sm font-semibold text-[#22c51f]">{item.category}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-2xl font-bold text-amber-500">${item.price.toFixed(2)}</p>
                <button type="button" className="text-neutral-400 hover:text-neutral-600" aria-label="Share">
                  <Share2 size={18} />
                </button>
                <button type="button" className="text-neutral-400 hover:text-neutral-600" aria-label="Bookmark">
                  <Bookmark size={18} />
                </button>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-6 border-y border-neutral-100 py-4">
              {stats.map(({ icon: Icon, label }) => (
                <span key={label} className="flex items-center gap-2 text-sm font-semibold text-neutral-600">
                  <Icon size={16} className="text-[#22c51f]" />
                  {label}
                </span>
              ))}
            </div>

            <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_220px]">
              <div>
                <h2 className="text-base font-bold text-neutral-800">Description</h2>
                <p className="mt-2 text-sm font-medium leading-relaxed text-neutral-600">{item.description}</p>

                <h2 className="mt-8 text-base font-bold text-neutral-800">Reviews</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {item.reviewSnippets.map((review) => (
                    <article
                      key={review.author}
                      className="rounded-xl bg-green-50/80 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <Image
                          src={review.avatar}
                          alt={review.author}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <p className="text-sm font-bold text-neutral-800">{review.author}</p>
                      </div>
                      <p className="mt-3 text-sm font-medium text-neutral-600">{review.text}</p>
                    </article>
                  ))}
                </div>
              </div>

              <aside className="rounded-xl border border-neutral-100 bg-neutral-50/50 p-5">
                <h2 className="text-base font-bold text-neutral-800">Ingredients</h2>
                <ul className="mt-3 space-y-2">
                  {item.ingredients.map((ing) => (
                    <li key={ing} className="text-sm font-semibold text-neutral-600">
                      • {ing}
                    </li>
                  ))}
                </ul>
              </aside>
            </div>

            <div className="mt-8 flex justify-end">
              <Button className="h-11 px-8">Edit Menu</Button>
            </div>
          </div>
        </DashboardCard>
      </div>

      <aside className="hidden w-[200px] shrink-0 xl:block">
        <h2 className="text-base font-bold text-neutral-800">Similar Menu</h2>
        <div className="mt-4 space-y-4">
          {similarItems.map((sim) => (
            <Link
              key={sim.id}
              href={`/dashboard/menu/${sim.id}`}
              className="block overflow-hidden rounded-xl border border-neutral-100 shadow-sm transition hover:shadow-md"
            >
              <div className="relative aspect-square bg-neutral-100">
                <Image src={sim.image} alt={sim.name} fill className="object-cover" sizes="200px" />
              </div>
            </Link>
          ))}
        </div>
      </aside>
    </div>
    </>
  );
}
