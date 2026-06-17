import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: 'linear-gradient(135deg, #7c5cff 0%, #5a3ee8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontFamily: 'serif',
            fontWeight: 900,
            fontSize: 20,
            color: 'white',
            fontStyle: 'italic',
            letterSpacing: '-1px',
            lineHeight: 1,
          }}
        >
          W
        </div>
      </div>
    ),
    { ...size }
  );
}
