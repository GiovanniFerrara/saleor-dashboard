import { ChannelData } from "@saleor/channels/utils";
import ActionDialog from "@saleor/components/ActionDialog";
import { ProductDetails_product_variants } from "@saleor/products/types/ProductDetails";
import { UseChannelsWithProductVariants } from "@saleor/products/views/ProductUpdate/types";
import {
  areAllVariantsAtAllChannelsSelected,
  areAnyChannelVariantsSelected
} from "@saleor/products/views/ProductUpdate/utils";
import { filter } from "fuzzaldrin";
import React from "react";
import { useIntl } from "react-intl";
import { defineMessages } from "react-intl";

import ChannelsAvailabilityContentWrapper from "../ChannelsAvailabilityDialogContentWrapper/ChannelsAvailabilityDialogContentWrapper";
import ChannelsWithVariantsAvailabilityDialogContent from "./ChannelsWithVariantsAvailabilityDialogContent";

const messages = defineMessages({
  title: {
    defaultMessage: "Manage Channels",
    description: "channels variants availability dialog title"
  }
});

type UseChannelsWithVariantsCommonProps = Omit<
  UseChannelsWithProductVariants,
  "setChannelsWithVariantsData" | "onChannelsAvailiabilityModalOpen"
>;

export interface ChannelsAvailabilityDialogProps
  extends Omit<
    UseChannelsWithVariantsCommonProps,
    "channelsData" | "setChannelsData"
  > {
  channels: ChannelData[];
  contentType?: string;
  variants: ProductDetails_product_variants[];
}

export const ChannelsWithVariantsAvailabilityDialog: React.FC<ChannelsAvailabilityDialogProps> = ({
  channels,
  contentType,
  variants,
  isChannelsAvailabilityModalOpen,
  toggleAllChannels,
  channelsWithVariantsData,
  onChannelsAvailiabilityModalClose,
  haveChannelsWithVariantsDataChanged,
  onChannelsWithVariantsConfirm,
  ...rest
}) => {
  const intl = useIntl();
  const [query, onQueryChange] = React.useState("");
  const filteredChannels = filter(channels, query, { key: "name" }) || [];

  const hasAllChannelsSelected = areAllVariantsAtAllChannelsSelected(
    variants,
    channelsWithVariantsData
  );

  const isChannelSelected = (channelId: string) =>
    areAnyChannelVariantsSelected(channelsWithVariantsData[channelId]);

  return (
    <ActionDialog
      confirmButtonState="default"
      open={isChannelsAvailabilityModalOpen}
      onClose={onChannelsAvailiabilityModalClose}
      onConfirm={onChannelsWithVariantsConfirm}
      title={intl.formatMessage(messages.title)}
      disabled={!haveChannelsWithVariantsDataChanged}
    >
      <ChannelsAvailabilityContentWrapper
        hasAllSelected={hasAllChannelsSelected}
        hasAnyChannelsToDisplay={!!filteredChannels.length}
        query={query}
        onQueryChange={onQueryChange}
        toggleAll={toggleAllChannels}
        contentType={contentType}
      >
        <ChannelsWithVariantsAvailabilityDialogContent
          allVariants={variants}
          channels={filteredChannels}
          isChannelSelected={isChannelSelected}
          channelsWithVariants={channelsWithVariantsData}
          {...rest}
        />
      </ChannelsAvailabilityContentWrapper>
    </ActionDialog>
  );
};

export default ChannelsWithVariantsAvailabilityDialog;