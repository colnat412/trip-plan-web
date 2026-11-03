'use client';
import TemplateItinerary from '@/features/plan-template/components/TemplateItinerary';
import AppPreferencesMenu from '@/base/components/preferences/AppPreferencesMenu';
import { Stack } from '@mui/material';
const ItineraryReview = () => (
  <Stack
    sx={{ p: 2, bgcolor: 'background.paper', minHeight: '100dvh', gap: 2 }}
  >
    <AppPreferencesMenu />
    <TemplateItinerary
      currency="VND"
      snapshot={{
        schemaVersion: 1,
        days: Array.from({ length: 6 }, (_, i) => ({
          dayNumber: i + 1,
          title: `Khám phá ngày ${i + 1}`,
          note: `Ghi chú ngày ${i + 1}`,
          activities:
            i === 5
              ? []
              : [
                  {
                    title: `Hoạt động ngày ${i + 1} — khám phá phố cổ và những địa điểm nổi bật trong chuyến đi`,
                    startTime: '08:30:00',
                    endTime: '10:00:00',
                    category: 'FOOD_BEVERAGE',
                    location:
                      'Địa điểm rất dài tại trung tâm thành phố dành cho chuyến đi cùng bạn bè',
                    note: 'Dòng ghi chú đầu tiên\nDòng ghi chú thứ hai',
                    estimatedCost: 250000,
                    orderIndex: 0,
                  },
                  {
                    title: 'Nghỉ ngơi',
                    startTime: null,
                    endTime: null,
                    category: 'ENTERTAINMENT',
                    location: null,
                    note: null,
                    estimatedCost: 0,
                    orderIndex: 1,
                  },
                ],
        })),
        checklists: [
          { title: 'Mang theo giấy tờ cá nhân', category: 'DOCUMENTS' },
        ],
      }}
    />
  </Stack>
);
export default ItineraryReview;
