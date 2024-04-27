import { SideNavigation } from "@cloudscape-design/components";
import { useTranslation } from "react-i18next";

export function LeftNav() {
  const { t } = useTranslation();
  return (
    <SideNavigation
      header={{
        href: "#",
        text: t("leftNav.title"),
      }}
      items={[
        {
          type: "link",
          text: t("leftNav.foreignaffairstool"),
          href: `foreignaffairs`,
        },
      ]}
    />
  );
}
