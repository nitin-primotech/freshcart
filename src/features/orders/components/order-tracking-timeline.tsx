import { StyleSheet, Text, View } from 'react-native';

import type { OrderStatus } from '@/features/catalog/types/catalog.types';
import {
  CANCELLED_TRACKING_STEP,
  formatTrackingStepTime,
  getCancelledProgressIndex,
  resolveTrackingStepState,
  TRACKING_STEPS,
  type TrackingTimestamps,
} from '@/features/orders/constants/orders.constants';
import { AppSymbol } from '@/shared/components/app-symbol';
import { colors, screens } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

type OrderTrackingTimelineProps = {
  status: OrderStatus;
  timestamps: TrackingTimestamps;
};

type TimelineRowProps = {
  icon: string;
  label: string;
  description: string;
  state: 'done' | 'active' | 'pending' | 'cancelled';
  timestamp: string | null;
  isLast: boolean;
  connectorDone: boolean;
};

function TimelineRow({
  icon,
  label,
  description,
  state,
  timestamp,
  isLast,
  connectorDone,
}: TimelineRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.rail}>
        <View
          style={[
            styles.iconWrap,
            state === 'done' && styles.iconDone,
            state === 'active' && styles.iconActive,
            state === 'pending' && styles.iconPending,
            state === 'cancelled' && styles.iconCancelled,
          ]}
        >
          {state === 'done' ? (
            <AppSymbol
              name="checkmark"
              size={12}
              tintColor={colors.textInverse}
            />
          ) : (
            <AppSymbol
              name={icon}
              size={14}
              tintColor={
                state === 'active' || state === 'cancelled'
                  ? colors.textInverse
                  : colors.textTertiary
              }
            />
          )}
        </View>
        {!isLast ? (
          <View
            style={[
              styles.line,
              connectorDone ? styles.lineDone : styles.linePending,
            ]}
          />
        ) : null}
      </View>

      <View
        style={[
          styles.content,
          state === 'active' && styles.contentActive,
          state === 'cancelled' && styles.contentCancelled,
          !isLast && styles.contentSpaced,
        ]}
      >
        <Text
          style={[
            styles.title,
            state === 'active' && styles.titleActive,
            state === 'cancelled' && styles.titleCancelled,
            state === 'pending' && styles.titlePending,
          ]}
        >
          {label}
        </Text>
        <Text
          style={[
            styles.description,
            state === 'cancelled' && styles.descriptionCancelled,
            state === 'pending' && styles.descriptionPending,
          ]}
        >
          {description}
        </Text>
        {timestamp ? <Text style={styles.timestamp}>{timestamp}</Text> : null}
      </View>
    </View>
  );
}

export function OrderTrackingTimeline({
  status,
  timestamps,
}: OrderTrackingTimelineProps) {
  if (status === 'cancelled') {
    const progress = getCancelledProgressIndex(timestamps);
    const completedSteps = TRACKING_STEPS.slice(0, progress + 1);

    return (
      <View style={styles.container}>
        {completedSteps.map((step) => (
          <TimelineRow
            key={step.key}
            icon={step.icon}
            label={step.label}
            description={step.description}
            state="done"
            timestamp={formatTrackingStepTime(step.key, 'done', timestamps)}
            isLast={false}
            connectorDone
          />
        ))}
        <TimelineRow
          icon={CANCELLED_TRACKING_STEP.icon}
          label={CANCELLED_TRACKING_STEP.label}
          description={CANCELLED_TRACKING_STEP.description}
          state="cancelled"
          timestamp={formatTrackingStepTime(
            'cancelled',
            'cancelled',
            timestamps,
          )}
          isLast
          connectorDone={false}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {TRACKING_STEPS.map((step, index) => {
        const state = resolveTrackingStepState(index, status, timestamps);
        const isLast = index === TRACKING_STEPS.length - 1;
        const timestamp = formatTrackingStepTime(step.key, state, timestamps);
        const connectorDone =
          !isLast &&
          resolveTrackingStepState(index + 1, status, timestamps) !== 'pending';

        return (
          <TimelineRow
            key={step.key}
            icon={step.icon}
            label={step.label}
            description={step.description}
            state={state}
            timestamp={timestamp}
            isLast={isLast}
            connectorDone={connectorDone}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 0,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  rail: {
    width: 28,
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderCurve: 'continuous',
  },
  iconDone: {
    backgroundColor: screens.tracking.activeStep,
  },
  iconActive: {
    backgroundColor: screens.tracking.activeStep,
  },
  iconPending: {
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  iconCancelled: {
    backgroundColor: colors.danger,
  },
  line: {
    flex: 1,
    width: 2,
    minHeight: 28,
    marginVertical: 4,
    borderRadius: 1,
  },
  lineDone: {
    backgroundColor: screens.tracking.activeStep,
  },
  linePending: {
    backgroundColor: colors.border,
    opacity: 0.7,
  },
  content: {
    flex: 1,
    paddingVertical: 2,
    paddingRight: spacing.xs,
  },
  contentActive: {
    backgroundColor: 'rgba(212, 84, 60, 0.08)',
    borderRadius: 10,
    borderCurve: 'continuous',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginBottom: spacing.xs,
  },
  contentCancelled: {
    backgroundColor: colors.dangerLight,
    borderRadius: 10,
    borderCurve: 'continuous',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginBottom: spacing.xs,
  },
  contentSpaced: {
    paddingBottom: spacing.sm,
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textPrimary,
  },
  titleActive: {
    color: colors.primary,
  },
  titleCancelled: {
    color: colors.danger,
  },
  titlePending: {
    color: colors.textTertiary,
    fontFamily: fonts.medium,
  },
  description: {
    marginTop: 2,
    fontFamily: fonts.regular,
    fontSize: 10,
    lineHeight: 14,
    color: colors.textSecondary,
  },
  descriptionCancelled: {
    color: '#991B1B',
  },
  descriptionPending: {
    color: colors.textTertiary,
  },
  timestamp: {
    marginTop: 4,
    fontFamily: fonts.regular,
    fontSize: 9,
    lineHeight: 12,
    color: colors.textTertiary,
  },
});
