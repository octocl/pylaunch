# AI / ML Projects

PyLaunch is suitable for experimenting with AI/ML APIs and lightweight models.

## Example use cases

- **OpenAI API** — call GPT, DALL-E, Whisper endpoints
- **Hugging Face** — use `transformers` for inference (small models only)
- **LangChain** — experiment with LLM chains and agents
- **Embeddings** — generate embeddings and store/send them
- **Data preprocessing** — clean and prepare datasets for ML

## Limitations

- **No GPU** — CPU-only execution; deep learning training is not feasible
- **Memory limit** — 256 MB / 1 GB limits model size (small models only)
- **Package install time** — `torch`, `transformers`, etc. are large and eat into timeout
- **No persistence** — models must be downloaded each run (wasted time)

## Best for

- API-based AI (where compute happens on the provider's side)
- Running small ONNX or quantized models
- Data preprocessing pipelines
- Learning ML concepts with small datasets
- Chaining LLM calls (LangChain, LlamaIndex)
