# GitHub Copilot Skills

This directory contains domain-specific skills that provide GitHub Copilot with expert knowledge for building browser-based AI applications.

## Available Skills

### 🤖 [Transformers.js Web AI](./transformersjs-web-ai/SKILL.md)

Expert guidance for building browser-based AI applications using Transformers.js, covering:
- Text generation with LLMs (Phi-4, Phi-3.5)
- Computer vision (object detection, segmentation)
- Natural language processing (sentiment, translation)
- WebGPU optimization and Web Worker patterns
- Production-ready code examples from this repo

**When to invoke:** Mention "Transformers.js", "WebGPU", "browser ML", or specific tasks like "sentiment analysis", "chat interface", "object detection"

## Using Skills

### In This Repo

Skills in this directory are automatically available when working on this repository. GitHub Copilot will reference them when relevant patterns or keywords are detected.

### Globally (All Projects)

To make these skills available across all your projects:

```bash
# Copy to global Copilot skills directory
cp -r .github/skills/* ~/.copilot/skills/

# Or create a symlink (recommended)
ln -s "$(pwd)/.github/skills/transformersjs-web-ai" ~/.copilot/skills/transformersjs-web-ai
```

After copying or linking, reload VS Code to activate the skills.

### Invoking Skills in Copilot Chat

**Explicit invocation:**
```
Use the transformersjs-web-ai skill to create a sentiment analyzer
```

**Natural invocation (automatic):**
```
How do I load a Phi-4 model with WebGPU?
Create a real-time object detection demo
Optimize this Transformers.js inference code
```

Copilot will automatically reference the skill when keywords match (e.g., "Transformers.js", "WebGPU", "model loading").

## Creating New Skills

To add a new skill:

1. **Create directory structure:**
   ```bash
   mkdir -p .github/skills/my-skill-name
   ```

2. **Create SKILL.md:**
   ```markdown
   # Skill: My Skill Name
   
   ## What this skill covers
   Brief description of the domain
   
   ## When to use
   - Trigger keywords and scenarios
   
   ## Architecture Patterns
   Proven patterns with code examples
   
   ## Best Practices
   Checklists and recommendations
   
   ## Code References
   Links to examples in this repo
   ```

3. **Reference repo code:**
   Include actual file paths and working examples from your codebase

4. **Test the skill:**
   Ask Copilot to use it by name or with trigger keywords

## Skill Best Practices

- ✅ **Include real code examples** from this repository
- ✅ **Provide checklists** for easy verification
- ✅ **Add trigger keywords** for automatic invocation
- ✅ **Reference actual file paths** (e.g., `phi-webgpu/src/worker.js`)
- ✅ **Keep content actionable** - patterns over prose
- ✅ **Update regularly** - note last updated date
- ❌ **Avoid generic advice** - be specific to your stack
- ❌ **Don't include secrets** - skills are plain text

## Related Documentation

- [Copilot Instructions](../copilot-instructions.md) - Project-wide AI coding guidelines
- [Project README](../../README.md) - Overview of all demos
- Individual demo READMEs - Specific implementation details

## Contributing

When adding new demos or patterns to this repo:
1. Update relevant skills with new examples
2. Add file references to "Code References" sections
3. Include lessons learned in "Common Pitfalls"
4. Update "Last Updated" timestamp

---

**Note:** Skills are a GitHub Copilot feature that provides domain-specific context. They complement the general [copilot-instructions.md](../copilot-instructions.md) which defines project-wide conventions.
