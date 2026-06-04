import { notFound } from "next/navigation";
import { MenuDetailView } from "../../../../components/dashboard/menu/MenuDetailView";
import { menuItems } from "../../../../lib/dashboard/mockData";

interface MenuItemPageProps {
  params: Promise<{ itemId: string }>;
}

export default async function MenuItemPage({ params }: MenuItemPageProps) {
  const { itemId } = await params;
  const item = menuItems.find((m) => m.id === itemId);

  if (!item) {
    notFound();
  }

  return <MenuDetailView item={item} />;
}
