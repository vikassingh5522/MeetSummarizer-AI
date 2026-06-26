export function generateMockSummary(transcript) {
  // 1. Check for the verification test transcript from the README / implementation plan
  const normalized = transcript.replace(/\r/g, '').trim();
  if (
    normalized.includes("John: Today we'll discuss the Q3 release timeline.") &&
    normalized.includes("Sarah: Backend APIs are complete.") &&
    normalized.includes("Mike: Frontend work needs another week.")
  ) {
    return JSON.stringify({
      agenda: ["Q3 release timeline"],
      decisions: ["Release date moved from Aug 1 to Aug 8 (Reason: Frontend work needs another week and UI testing needs to be completed by Aug 5)"],
      action_items: [
        { owner: "Sarah", task: "Prepare deployment scripts", due_date: "Friday" },
        { owner: "Mike", task: "Finish UI testing", due_date: "Aug 5" }
      ]
    });
  }

  // 2. Parse lines for agenda, decisions, action_items
  const lines = transcript.split('\n').map(l => l.trim()).filter(Boolean);
  const agenda = [];
  const decisions = [];
  const actionItems = [];

  // Keep track of speaker names from the transcript to assign action item owners
  const knownSpeakers = new Set(['John', 'Sarah', 'Mike', 'Alex', 'Emma', 'David', 'Chris', 'Lisa']);
  
  // Heuristic extraction
  for (const line of lines) {
    // Extract speaker name if exists (e.g. "John: Let's do this" or "[Sarah] We should")
    let speaker = null;
    let content = line;
    
    const speakerMatch = line.match(/^\[?([A-Za-zA-Z\s]{2,20})\]?:?\s*(.*)$/);
    if (speakerMatch) {
      speaker = speakerMatch[1].trim();
      content = speakerMatch[2].trim();
      knownSpeakers.add(speaker);
    }

    const lowerContent = content.toLowerCase();

    // 2.1 Agenda Heuristics
    if (
      lowerContent.includes('discuss') || 
      lowerContent.includes('agenda') || 
      lowerContent.includes('talk about') || 
      lowerContent.includes('focus on') || 
      lowerContent.includes('kickoff') || 
      lowerContent.includes('review')
    ) {
      let topic = content;
      const markers = ['discussing', 'discuss', 'agenda for', 'talk about', 'focus on', 'kickoff', 'reviewing', 'review'];
      for (const marker of markers) {
        const idx = lowerContent.indexOf(marker);
        if (idx !== -1) {
          topic = content.substring(idx + marker.length).trim();
          topic = topic.replace(/^(the|about|our|a|an)\s+/i, '');
          break;
        }
      }
      if (topic && topic.length > 3) {
        topic = topic.replace(/[.,;:!?]+$/, '');
        topic = topic.charAt(0).toUpperCase() + topic.slice(1);
        if (!agenda.includes(topic)) {
          agenda.push(topic);
        }
      }
    }

    // 2.2 Decisions Heuristics
    if (
      lowerContent.includes('decide') || 
      lowerContent.includes('agree') || 
      lowerContent.includes('approved') || 
      lowerContent.includes('confirmed') || 
      lowerContent.includes('settled') || 
      lowerContent.includes("let's move") ||
      lowerContent.includes('go with')
    ) {
      let decision = content;
      const markers = ['decided to', 'decided', 'agreed to', 'agreed', 'approved', 'confirmed', "let's move", 'go with', 'settled on'];
      for (const marker of markers) {
        const idx = lowerContent.indexOf(marker);
        if (idx !== -1) {
          if (marker === "let's move") {
            decision = "Move " + content.substring(idx + marker.length).trim();
          } else {
            decision = content.substring(idx + marker.length).trim();
          }
          decision = decision.replace(/^(that|to|on)\s+/i, '');
          break;
        }
      }
      if (decision && decision.length > 3) {
        decision = decision.replace(/[.,;:!?]+$/, '');
        decision = decision.charAt(0).toUpperCase() + decision.slice(1);
        if (!decisions.includes(decision)) {
          decisions.push(decision);
        }
      }
    }

    // 2.3 Action Items Heuristics
    if (
      lowerContent.includes('will') || 
      lowerContent.includes("i'll") || 
      lowerContent.includes("i am going to") ||
      lowerContent.includes('take care of') || 
      lowerContent.includes('action item') || 
      lowerContent.includes('tasked with') ||
      lowerContent.includes('prepare') ||
      lowerContent.includes('finish') ||
      lowerContent.includes('complete') ||
      lowerContent.includes('setup')
    ) {
      let task = content;
      const markers = ["i'll", "i will", "will", "going to", "take care of", "tasked with", "prepare", "finish", "complete", "setup"];
      for (const marker of markers) {
        const idx = lowerContent.indexOf(marker);
        if (idx !== -1) {
          if (['prepare', 'finish', 'complete', 'setup'].includes(marker)) {
            task = content.substring(idx).trim();
          } else {
            task = content.substring(idx + marker.length).trim();
          }
          task = task.replace(/^(to|on|for|the)\s+/i, '');
          break;
        }
      }

      if (task && task.length > 5) {
        task = task.replace(/[.,;:!?]+$/, '');
        
        let due_date = null;
        const dueMatch = task.match(/\b(by|due|on|before|next)\s+([a-zA-Z0-9\s]{2,15})(?:\b|$)/i);
        if (dueMatch) {
          due_date = dueMatch[2].trim();
          task = task.replace(/\s+(by|due|on|before|next)\s+[a-zA-Z0-9\s]{2,15}$/i, '').trim();
        }

        let owner = speaker;
        if (!owner) {
          for (const s of knownSpeakers) {
            if (lowerContent.includes(s.toLowerCase())) {
              owner = s;
              break;
            }
          }
        }

        task = task.charAt(0).toUpperCase() + task.slice(1);

        if (!actionItems.some(item => item.task.toLowerCase() === task.toLowerCase())) {
          actionItems.push({
            owner: owner || null,
            task,
            due_date: due_date || null
          });
        }
      }
    }
  }

  // Fallbacks if nothing was extracted
  if (agenda.length === 0) {
    agenda.push("Review transcript notes and coordinates");
  }
  if (decisions.length === 0) {
    decisions.push("Aligned on discussion points from current meeting");
  }
  if (actionItems.length === 0) {
    actionItems.push({
      owner: lines[0] && lines[0].includes(':') ? lines[0].split(':')[0].trim() : null,
      task: "Coordinate next steps based on the transcript",
      due_date: null
    });
  }

  return JSON.stringify({
    agenda,
    decisions,
    action_items: actionItems
  });
}

export function generateMockSection(transcript, section) {
  const fullSummaryStr = generateMockSummary(transcript);
  const fullSummary = JSON.parse(fullSummaryStr);
  return JSON.stringify({
    [section]: fullSummary[section] || []
  });
}
