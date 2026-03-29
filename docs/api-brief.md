# PiAPI Video API Brief

Короткий рабочий справочник по выбору модели, цене и пайплайну.

## Рекомендуемый пайплайн

`generate video -> remove watermark -> download final file`

Для `Seedance` удаление вотермарка в проекте уже заложено как post-process step.

## Лучшие модели

| Задача | Модель | Почему |
|---|---|---|
| Лучший баланс цена/качество | `seedance-2-fast-preview` | Быстро, дешево, удобно для тестов и перебора промтов |
| Лучший финальный рендер в Seedance | `seedance-2-preview` | Выше качество, подходит для финальных роликов |
| Лучший value в high quality | `wan-2.6 1080p` | Сильное качество при умеренной цене |
| Премиум-качество | `veo-3.1-video` | Топ по realism, physics, prompt adherence |
| Коммерческий/рекламный стиль | `kling-3.0 omni 1080p` | Сильный ad look, control, текст в кадре |

## Цена за генерацию

| Модель | Цена |
|---|---:|
| `seedance-2-fast-preview` | `$0.08/сек` |
| `seedance-2-preview` | `$0.15/сек` |
| `wan-2.6 720p` | `$0.08/сек` |
| `wan-2.6 1080p` | `$0.12/сек` |
| `veo-3.1-video-fast no audio` | `$0.06/сек` |
| `veo-3.1-video-fast audio` | `$0.09/сек` |
| `veo-3.1-video no audio` | `$0.12/сек` |
| `veo-3.1-video audio` | `$0.24/сек` |
| `kling-3.0 omni 720p` | `$0.15/сек` |
| `kling-3.0 omni 720p + audio` | `$0.20/сек` |
| `kling-3.0 omni 1080p` | `$0.20/сек` |
| `kling-3.0 omni 1080p + audio` | `$0.30/сек` |

## Цена за 5 и 10 секунд

| Модель | 5 сек | 10 сек |
|---|---:|---:|
| `seedance-2-fast-preview` | `$0.40` | `$0.80` |
| `seedance-2-preview` | `$0.75` | `$1.50` |
| `wan-2.6 1080p` | `$0.60` | `$1.20` |
| `veo-3.1-video no audio` | `$0.60` | `$1.20` |
| `veo-3.1-video audio` | `$1.20` | `$2.40` |
| `kling-3.0 omni 1080p` | `$1.00` | `$2.00` |
| `kling-3.0 omni 1080p + audio` | `$1.50` | `$3.00` |

## Длина роликов

| Модель | Длина |
|---|---|
| `Seedance 2.0` | duration настраивается, на публичной странице PiAPI явный максимум не указан |
| `Wan 2.6` | до `15 секунд` |
| `Kling 3.0 Omni` | до `15 секунд` |
| `Veo 3.1` | duration настраивается |

## Вотермарк

| Модель | Removal |
|---|---|
| `Seedance` | Нужно закладывать в pipeline как обязательный шаг |
| `Seedance` | Публичная цена PiAPI для removal сейчас `undisclosed` |
| `Sora 2` | Публичная цена removal есть: `$0.003/сек` |

## Практическая рекомендация

### Если нужно быстро и много

- `seedance-2-fast-preview`
- 5 сек: `$0.40`
- 10 сек: `$0.80`

### Если нужен финальный хороший результат в Seedance

- `seedance-2-preview`
- 5 сек: `$0.75`
- 10 сек: `$1.50`

### Если нужен максимум качества

- `veo-3.1-video`
- 5 сек: `$0.60` без audio или `$1.20` с audio
- 10 сек: `$1.20` без audio или `$2.40` с audio

### Если нужен лучший value в high quality

- `wan-2.6 1080p`
- 5 сек: `$0.60`
- 10 сек: `$1.20`

## Что брать для Ballybunion / Golf / Travel

1. Тесты промтов: `seedance-2-fast-preview`
2. Финальные вертикальные ролики: `seedance-2-preview`
3. Hero-видео и самые важные ролики: `veo-3.1-video`

## Что уже поддерживает проект

- prompt generation
- generate
- status
- history
- download
- cost summary
- remove-watermark step в pipeline

## Важное ограничение

Для `Seedance` точную финальную цену `generation + remove watermark` сейчас нельзя посчитать честно в USD, потому что PiAPI не публикует removal price. В проекте это явно помечается как `undisclosed`.

## Источники

- [Seedance 2.0](https://piapi.ai/seedance-2-0)
- [Wan 2.6](https://piapi.ai/wan/wan-2-6)
- [Veo 3.1](https://piapi.ai/veo-3-1)
- [Kling 3.0 Omni](https://piapi.ai/kling-3-0)
- [Kling 3.0 Omni docs](https://piapi.ai/docs/kling-api/kling-3-omni-api)
- [PiAPI Pricing](https://piapi.ai/pricing)
- [Sora Remove Watermark](https://piapi.ai/sora-remove-watermark)
