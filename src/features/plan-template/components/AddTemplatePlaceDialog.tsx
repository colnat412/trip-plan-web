"use client";
import { useState } from "react";
import Link from "next/link";
import { CircularProgress, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { AppDialog, AppButton, AppSelect } from "@/base/components/ui";
import AppErrorState from "@/base/components/ui/AppErrorState";
import { useOptionalUserContext } from "@/features/user/context/UserContext";
import { useAppToast } from "@/base/providers/AppToastProvider";
import AddActivityDialog from "@/features/plan/components/AddActivityDialog";
import type { CreateActivityPayload } from "@/features/plan/types";
import usePlaceTripTarget from "../hooks/usePlaceTripTarget";
export type TemplatePlaceSeed = Pick<
  CreateActivityPayload,
  "title" | "location" | "category"
>;
interface AddTemplatePlaceDialogProps {
  place: TemplatePlaceSeed;
  onClose: () => void;
  templateId?: string;
}
function SignedInPlaceTarget({ place, onClose }: AddTemplatePlaceDialogProps) {
  const t = useTranslations("planTemplate");
  const model = usePlaceTripTarget();
  const [editing, setEditing] = useState(false);
  const notify = useAppToast();
  const tripOptions = model.trips.items.map((trip) => ({
    value: String(trip.id),
    label: trip.name,
  }));
  if (
    model.trip &&
    !tripOptions.some((option) => option.value === String(model.trip!.id))
  )
    tripOptions.unshift({
      value: String(model.trip.id),
      label: model.trip.name,
    });
  if (editing && model.trip && model.day)
    return (
      <AddActivityDialog
        open
        onClose={onClose}
        initialValues={place}
        destination={model.trip.destination}
        tripCurrency={model.trip.baseCurrency}
        planDate={model.day.planDate}
        isLoading={model.create.isPending}
        onSubmit={async (payload) => {
          try {
            await model.create.createActivityAsync(payload);
            notify(t("placeAdded"));
            onClose();
          } catch (error) {
            notify(t("placeAddFailed"), "error");
            throw error;
          }
        }}
      />
    );
  return (
    <AppDialog
      open
      title={t("addPlaceToTrip")}
      onClose={onClose}
      actions={
        <AppButton
          disabled={!model.trip || !model.day}
          onClick={() => setEditing(true)}
        >
          {t("continueAddPlace")}
        </AppButton>
      }
    >
      <Stack spacing={2} useFlexGap>
        <Typography sx={{ fontWeight: 700 }}>{place.title}</Typography>
        <AppSelect
          label={t("chooseTargetTrip")}
          searchable
          value={model.trip ? String(model.trip.id) : ""}
          options={tripOptions}
          onSearchChange={model.setSearch}
          optionsLoading={model.trips.isLoading}
          optionsError={!!model.trips.error}
          onChange={(event) => {
            const trip = model.trips.items.find(
              (item) => String(item.id) === String(event.target.value),
            );
            if (trip) model.selectTrip(trip);
          }}
        />
        {model.trips.error && (
          <AppErrorState
            compact
            status={model.trips.error.status}
            onRetry={model.trips.refetch}
          />
        )}
        {model.trips.hasNextPage && (
          <AppButton
            intent="text"
            disabled={model.trips.isFetching}
            onClick={() => void model.trips.fetchNextPage()}
          >
            {t("moreTargetTrips")}
          </AppButton>
        )}
        {!model.trips.isLoading &&
          !model.trips.error &&
          !model.trips.items.length && (
            <AppButton component={Link} href="/trips" intent="secondary">
              {t("createTargetTrip")}
            </AppButton>
          )}
        {model.days.error && (
          <AppErrorState
            compact
            status={model.days.error.status}
            onRetry={model.days.refetch}
          />
        )}
        <AppSelect
          label={t("chooseTargetDay")}
          value={model.dayId}
          disabled={!model.plan}
          options={(model.plan?.days ?? []).map((day) => ({
            value: String(day.id),
            label:
              t("day", { number: day.dayNumber }) +
              (day.title ? ` · ${day.title}` : ""),
          }))}
          onChange={(event) => model.setDayId(String(event.target.value))}
        />
        {model.plan && !model.plan.days.length && (
          <Typography variant="body2">{t("targetNoDays")}</Typography>
        )}
      </Stack>
    </AppDialog>
  );
}
export default function AddTemplatePlaceDialog(
  props: AddTemplatePlaceDialogProps,
) {
  const account = useOptionalUserContext();
  const user = account?.user;
  const t = useTranslations("planTemplate");
  if (account?.isLoading)
    return (
      <AppDialog open title={t("addPlaceToTrip")} onClose={props.onClose}>
        <CircularProgress size={24} />
      </AppDialog>
    );
  if (!user)
    return (
      <AppDialog
        open
        title={t("addPlaceToTrip")}
        onClose={props.onClose}
        actions={
          <AppButton
            component={Link}
            href={`/login?returnTo=${encodeURIComponent(props.templateId ? `/templates/${props.templateId}` : "/explore")}`}
          >
            {t("login")}
          </AppButton>
        }
      >
        <Typography>{t("loginRequired")}</Typography>
      </AppDialog>
    );
  return <SignedInPlaceTarget {...props} />;
}
