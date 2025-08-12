import React, {
  useEffect, useMemo, useState,
} from 'react';
import {
  Paper, Text, Box, Button, Stack,
} from '@mantine/core';

interface RankingWidgetProps {
  baseSequence: string[];
  value: string[];
  onChange?: (order: string[]) => void;
}

export default function RankingWidget({ baseSequence, value, onChange }: RankingWidgetProps) {
  const labelMap = useMemo(
    () => Object.fromEntries(baseSequence.map((g, i) => [g, `Chart ${String.fromCharCode(65 + i)}`])),
    [baseSequence],
  );

  const [order, setOrder] = useState<string[]>(value);
  const [dragged, setDragged] = useState<string | null>(null);
  const [preview, setPreview] = useState<string[] | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  useEffect(() => {
    if (!dragged && (value.length !== order.length || value.some((v, i) => v !== order[i]))) {
      setOrder(value);
      setPreview(null);
      setOverId(null);
    }
  }, [value, dragged, order]);

  const current = preview ?? order;

  const moveItem = (arr: string[], fromId: string, toId: string) => {
    if (fromId === toId) return arr;
    const from = arr.indexOf(fromId);
    const to = arr.indexOf(toId);
    if (from === -1 || to === -1) return arr;
    const next = [...arr];
    next.splice(from, 1);
    next.splice(to, 0, fromId);
    return next;
  };

  const handleDragStart = (id: string) => setDragged(id);
  const handleDragEnd = () => {
    setDragged(null);
    setPreview(null);
    setOverId(null);
  };

  const handleDragOver = (targetId: string, e: React.DragEvent) => {
    e.preventDefault();
    if (!dragged) return;
    setOverId(targetId);
    const base = preview ?? order;
    const next = moveItem(base, dragged, targetId);
    if (next.join('|') !== base.join('|')) setPreview(next);
  };

  const handleDrop = (targetId: string) => {
    if (!dragged) return;
    const base = preview ?? order;
    const committed = moveItem(base, dragged, targetId);
    setOrder(committed);
    setDragged(null);
    setPreview(null);
    setOverId(null);
    onChange?.(committed);
  };

  return (
    <Box>
      <Text fw={500} ta="center" mb="xs">
        Please rank the charts from best to worst in terms of how appropriate and useful they are as comparisons for Norway. (Top = Best)
      </Text>
      <Stack gap="xs" align="center">
        {current.map((guardrailId, idx) => {
          const label = labelMap[guardrailId] || guardrailId;
          const posLabel = idx === 0 ? 'Best' : idx === current.length - 1 ? 'Worst' : '•';
          return (
            <Box
              key={guardrailId}
              style={{
                display: 'flex',
                alignItems: 'stretch',
                gap: 8,
                width: '100%',
                maxWidth: 480,
              }}
            >
              <Box
                style={{
                  width: 50,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  fontSize: 16,
                  fontWeight: 600,
                  color: posLabel ? '#495057' : '#adb5bd',
                  userSelect: 'none',
                  paddingRight: 4,
                }}
              >
                {posLabel}
              </Box>
              <Paper
                shadow={dragged === guardrailId ? 'md' : 'xs'}
                p="md"
                radius="md"
                withBorder
                style={{
                  flex: 1,
                  minHeight: 56,
                  opacity: dragged === guardrailId ? 0.5 : 1,
                  cursor: 'grab',
                  background: dragged === guardrailId ? '#f1f3f5' : overId === guardrailId ? '#edf2ff' : undefined,
                  outline: overId === guardrailId ? '2px dashed #4c6ef5' : undefined,
                  transition: 'box-shadow 0.2s, opacity 0.2s, background 0.1s',
                }}
                draggable
                aria-label={`${label} position ${idx + 1}${posLabel ? ` (${posLabel})` : ''}`}
                onDragStart={() => handleDragStart(guardrailId)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(guardrailId, e)}
                onDragEnter={(e) => handleDragOver(guardrailId, e as unknown as React.DragEvent)}
                onDrop={() => handleDrop(guardrailId)}
              >
                <Text ta="center" fw={700}>{label}</Text>
              </Paper>
            </Box>
          );
        })}
      </Stack>
      <Box mt="sm" ta="center">
        <Button
          size="xs"
          variant="light"
          onClick={() => {
            setOrder(baseSequence);
            setPreview(null);
            setOverId(null);
            onChange?.(baseSequence);
          }}
        >
          Reset order
        </Button>
      </Box>
    </Box>
  );
}
