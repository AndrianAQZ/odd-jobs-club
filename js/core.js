// Odd Jobs: catalogue, Australian occupation matching, and transparent estimates.
const path = name => new URL('../data/'+name, import.meta.url).href;
export const TIERS = Object.freeze([
 {key:'common',label:'Common',odds:50,colour:'#396a57'},
 {key:'uncommon',label:'Uncommon',odds:25,colour:'#458d83'},
 {key:'rare',label:'Rare',odds:15,colour:'#386eb0'},
 {key:'epic',label:'Epic',odds:5,colour:'#7951a0'},
 {key:'legendary',label:'Legendary',odds:5,colour:'#f0c06b'}
]);
export const LEGENDARY=[
 'Anaesthetist','Neurosurgeon','Cardiothoracic Surgeon','Orthopaedic Surgeon','Vascular Surgeon','Consultant Cardiologist',
 'Interventional Radiologist','Specialist Physician','Mining Engineering Director','Chief Technology Officer','AI Research Director',
 'Quantitative Trader','Private Equity Partner','Investment Banking Managing Director','Chief Executive Officer','Corporate Barrister',
 'Construction Director','Medical Director','Petroleum Engineer','Principal Mining Engineer','Chief Information Security Officer',
 'Oral and Maxillofacial Surgeon','Nuclear Medicine Specialist','Chief Investment Officer','Chief Financial Officer',
 'Engineering Director','Head of Neurosurgery','Commodities Trading Director','Chief Operating Officer','Investment Fund Manager'
];
export const EPIC=[
 'Surgeon','Anaesthesiologist','Cardiologist','Radiologist','Psychiatrist','Airline Captain','Air Traffic Controller',
 'Mining Engineer','Software Architect','Cloud Architect','Principal Software Engineer','Data Science Director','Research Scientist',
 'Chief Pilot','Corporate Lawyer','Barrister','Dentist','Orthodontist','Engineering Manager','Cybersecurity Director',
 'Senior Quantitative Analyst','Machine Learning Researcher','Senior Data Scientist','Aerospace Engineer','Film Director',
 'Game Studio Director','Marine Biologist','Formula One Engineer','Veterinary Surgeon','Creative Director','Architect',
 'Commercial Pilot','Rocket Engineer','Pharmaceutical Research Scientist','Industrial Design Director','Ship Captain',
 'Oil Rig Manager','Forensic Pathologist','Clinical Geneticist','Senior Economist','University Professor'
];
export const RARE=[
 'Software Engineer','Software Developer','Data Scientist','Cybersecurity Engineer','AI Engineer','Robotics Engineer',
 'Electrician','Physiotherapist','Registered Nurse','Firefighter','Architectural Designer','Landscape Architect',
 'Airline Pilot','Environmental Scientist','Wildlife Photographer','Motion Picture Editor','Investigative Journalist',
 'Video Game Designer','Pilot','UX Researcher','Biomedical Engineer','Veterinarian','Civil Engineer','Pilot Instructor',
 'Physicist','Marine Engineer','Geologist','Railway Engineer','Paramedic','Surgical Nurse','Forensic Scientist',
 'Computer Vision Engineer','Technical Artist','Professional Athlete','Astronaut','Animation Director',
 'Operations Research Analyst','Climate Scientist','Renewable Energy Engineer','Conservation Biologist'
];
export const EXTRAS = [
 'Bed Setter','Mixed Runner','Snake Milker','Professional Sleeper','Water Slide Tester','Pet Food Taster',
 'Golf Ball Diver','Professional Mourner','Fortune Cookie Writer','Chicken Sexer','Island Caretaker',
 'Human Statue Performer','Odour Judge','Worm Grunter','Iceberg Mover','Mermaid Performer','Ghost Hunter',
 'Professional Cuddler','Crime Scene Cleaner','Stunt Double','Adult Film Performer','Adult Content Creator',
 'Erotic Fiction Writer','Exotic Dancer','Intimacy Coordinator','Adult Entertainment Producer',
 'Sexual Wellness Educator','Erotic Photographer','Adult Entertainment Venue Manager','Online Adult Performer'
];
export const CATEGORIES=[
 'All industries','Technology & data','Health & medicine','Engineering','Business & finance','Law & government',
 'Arts & media','Education & research','Construction & trades','Food & hospitality','Transport & logistics',
 'Nature & agriculture','Sport & recreation','Personal services','Adult industry','Unusual & niche','Other'
];
const rules=[
 ['Adult industry', /\b(adult content|adult film|adult entertainment|erotic|exotic dancer|sex worker|pornograph|intimacy coordinator|cam model|adult performer)\b/i],
 ['Unusual & niche',/\b(snake milker|professional sleeper|water slide tester|pet food taster|golf ball diver|professional mourner|fortune cookie|chicken sexer|island caretaker|human statue|odour judge|worm grunter|iceberg mover|mermaid performer|ghost hunter|professional cuddler|crime scene cleaner)\b/i],
 ['Health & medicine',/\b(doctor|surgeon|nurse|medical|physician|cardiolog|clinical|anaesthet|anesthesi|dentist|radiolog|orthodon|therapist|pharmacist|psychiatr|psycholog|health|paramedic|epidemiolog|ophthalmolog|neurolog|veterinar|physiotherap|patholog|biomed|midwi|dietitian|nutritionist)\b/i],
 ['Technology & data',/\b(software|developer|programmer|web design|data|cyber|machine learning|cloud|network|computer|IT\b|digital|artificial intelligence|information technolog|tech lead|chief technology|systems admin|game developer|robotic|UX |UI |blockchain|mobile app|security engineer)\b/i],
 ['Engineering',/\b(engineer|aerospace|manufactur|fabricat|mechanical|electronic|industrial|machinist|production|metallurg|petroleum|plant operator|technician|assembly|toolmaker|mechanic|quality assurance|quality control|machinery|mining)\b/i],
 ['Law & government',/\b(lawyer|barrister|attorney|legal|judge|police|detective|diplomat|minister|government|legislat|military|army|navy|customs|immigration|public policy|prison|correction|firefighter|fire fighter|forensic)\b/i],
 ['Business & finance',/\b(financ|account|bank|tax |audit|trader|investment|business|marketing|sales|consultant|actuar|econom|chief executive|CEO|CFO|director|manager|entrepreneur|recruit|payroll|broker|asset|insurance|commerce|stock|human resources|project manager|operations manager)\b/i],
 ['Arts & media',/\b(artist|art director|illustrat|design|photograph|film|cinema|video|music|singer|actor|stage|theatre|theater|animat|producer|editor|writer|journalist|reporter|broadcast|podcast|dancer|choreograph|performer|fashion|costume|sculptor|curator|painter|media)\b/i],
 ['Education & research',/\b(teacher|tutor|educat|school|lecturer|professor|academic|librarian|curriculum|research|scientist|physicist|biolog|chemist|astronom|archaeolog|historian|trainer|pedagog|scholar)\b/i],
 ['Construction & trades',/\b(construction|carpenter|electrician|plumber|bricklayer|roofer|tiler|builder|stonemason|scaffold|contractor|excavator|flooring|glazier|architectural|surveyor|painter|plasterer|joiner|landscap|installer)\b/i],
 ['Food & hospitality',/\b(chef|cook|kitchen|restaurant|cater|waiter|bartender|barista|baker|hotel|hospitality|sommelier|brewer|food|pastry|butcher|housekeeper|concierge|receptionist|bed setter|mixed runner|accommodation)\b/i],
 ['Transport & logistics',/\b(driver|pilot|aviat|flight|airline|ship|sailor|captain|marine|seafarer|train|transport|logistic|warehouse|delivery|deliverer|courier|truck|shipping|supply chain|forklift|dispatcher|air traffic|traffic controller|port operator|postal|postman|mail|freight|cargo|bus driver|taxi)\b/i],
 ['Nature & agriculture',/\b(farm|agricultur|animal|wildlife|zoo|forest|botan|garden|horticultur|fisher|ecolog|environment|conserv|ranger|beekeeper|florist|horse|crop|livestock|aquacultur|geolog|climate|oceanograph)\b/i],
 ['Sport & recreation',/\b(athlete|sport|coach|fitness|trainer|gym|yoga|swim|football|soccer|tennis|climb|surf|ski|referee|lifeguard|martial arts|personal training)\b/i],
 ['Personal services',/\b(hair|beauty|cosmet|makeup|spa |massage|nail|barber|stylist|tattoo|personal shopper|wellness|jeweller|jewelry|interior decorator|groomer)\b/i]
];
export function industry(title){for(const [name,pattern] of rules)if(pattern.test(title))return name;return 'Other'}
export function rand(n){if(n<=0)throw new Error('Empty job pool');const a=new Uint32Array(1),max=4294967296,lim=max-(max%n);do{crypto.getRandomValues(a)}while(a[0]>=lim);return a[0]%n}
export function choose(arr){return arr[rand(arr.length)]}
const norm = s => String(s).toLowerCase().replace(/&/g,' and ').replace(/[^a-z0-9]+/g,' ').replace(/\b(senior|junior|lead|principal|assistant|trainee|graduate|chief|head|director|ii|iii)\b/g,'').replace(/\s+/g,' ').trim();
const short = s => norm(s).replace(/\b(and|the|of|for|in|at)\b/g,'').trim();
const singular = s => norm(s).split(' ').map(w=>w.endsWith('ies')&&w.length>4?w.slice(0,-3)+'y':w.endsWith('s')&&!w.endsWith('ss')&&w.length>4?w.slice(0,-1):w).join(' ');

const money=new Intl.NumberFormat('en-AU',{style:'currency',currency:'AUD',maximumFractionDigits:0});
export const aud=n=>money.format(Math.round(n/1000)*1000);
const special={
 'bed setter':{description:'Prepares beds and sleeping areas for guests or patients, fitting clean sheets, pillows and protective covers to the required standard. Checks for damage or hygiene issues and coordinates linen changes with the housekeeping team.',tasks:['Fit and replace linen to a consistent presentation standard','Check mattresses, bedding and room hygiene','Record linen shortages and report damaged items'],path:'Usually trained on the job in accommodation, hospitality or care services.',code:'8114'},
 'mixed runner':{description:'Moves materials, ingredients or completed items between production stations, storage and service areas. Keeps supplies moving so operators can work without delays. The exact tasks depend on the workplace.',tasks:['Collect and deliver materials to designated stations','Keep work areas supplied and organised','Follow manual-handling and workplace safety procedures'],path:'Often an entry-level role with workplace safety and handling training.',code:'8911'},
 'snake milker':{description:'Collects venom from venomous snakes under carefully controlled conditions. The venom may be used for antivenom production or scientific research. This role involves specialist reptile handling and significant safety controls.',tasks:['Handle and monitor venomous reptiles using approved procedures','Collect and label venom samples','Maintain secure enclosures and detailed safety records'],path:'Specialist experience with venomous reptiles, laboratory procedures and employer safety accreditation.',code:'3611'},
 'professional sleeper':{description:'Participates in a study or product test where sleep quality, bedding or overnight conditions are assessed. Records comfort, sleep patterns or feedback according to a testing protocol.',tasks:['Follow test schedules and study conditions','Record observations about sleep and comfort','Give structured feedback to researchers or product teams'],path:'Usually temporary testing or research participation, not a standard salaried occupation.',code:'8114'},
 'water slide tester':{description:'Tests waterslides for ride experience and reports flow, comfort and observed safety issues to operators or designers. Does not replace formal engineering safety certification.',tasks:['Test ride conditions under approved safety procedures','Document water flow and ride experience','Flag maintenance and operational concerns'],path:'Experience in water-park operations, lifeguarding or leisure-facility safety is relevant.',code:'4523'},
 'golf ball diver':{description:'Retrieves lost golf balls from ponds and water hazards at golf courses, often in poor visibility. Sorts and cleans recoverable balls for reuse or resale.',tasks:['Plan safe dives around water hazards','Recover and sort submerged golf balls','Clean equipment and follow diving safety procedures'],path:'Commercial diving experience, site safety assessment and appropriate diving credentials may be required.',code:'3999'},
 'chicken sexer':{description:'Sorts newly hatched chicks by sex at poultry hatcheries using trained visual identification methods. Accuracy, animal welfare and biosecurity are central to the work.',tasks:['Examine chicks using approved identification methods','Separate and count chicks accurately','Follow hatchery biosecurity and animal-welfare standards'],path:'Specialist hatchery training and supervised practice.',code:'8415'},
 'adult content creator':{description:'Plans, produces and distributes media intended for adult audiences where permitted by law. Work includes production scheduling, platform management, privacy and consent procedures.',tasks:['Plan and edit media for selected platforms','Manage permissions and protect personal data','Follow applicable legal and workplace rules'],path:'No single qualification; production skills, contracts, consent and jurisdiction-specific legal requirements matter.',code:'2123'}
};
// Selected niche roles receive manually written descriptions instead of generic filler.
Object.assign(special,{
 'pet food taster':{description:'Evaluates pet-food recipes, appearance, aroma and texture as part of product quality testing. In many workplaces the emphasis is sensory analysis rather than literally eating the finished product.',tasks:['Check sample consistency, aroma and texture','Record results against formulation standards','Report defects to product development or quality teams'],path:'Food science, quality assurance or sensory-panel training may be useful.',code:'2342'},
 'professional mourner':{description:'Attends a funeral or memorial in a paid ceremonial capacity. The service can involve supporting traditional mourning customs, joining a procession or representing an agreed role at an event.',tasks:['Follow the family or organiser’s ceremonial instructions','Maintain respectful conduct throughout proceedings','Coordinate attendance and dress requirements'],path:'Usually contract work arranged through ceremonies or specialist agencies.',code:'4513'},
 'fortune cookie writer':{description:'Writes short messages, jokes and predictions for insertion into fortune cookies. The job combines concise copywriting, originality and consistency with the brand’s editorial style.',tasks:['Draft batches of short fortunes and jokes','Edit lines to fit print length and tone','Track repeats and submit copy for approval'],path:'Copywriting, editing or creative writing experience.',code:'2122'},
 'island caretaker':{description:'Maintains buildings and facilities on a remote island property or conservation site. Duties can include repairs, supply checks, monitoring conditions and reporting to owners or rangers.',tasks:['Inspect accommodation, equipment and utilities','Coordinate deliveries and basic maintenance','Log environmental, safety or visitor issues'],path:'Practical maintenance, remote-area safety and sometimes maritime qualifications.',code:'8991'},
 'human statue performer':{description:'Performs as a stationary or slow-moving living statue at events or public venues. Costume, physical stamina and audience interaction are central to the act.',tasks:['Create a costume and movement routine','Perform for visitors while controlling posture','Manage public interaction and venue rules'],path:'Performance practice, stamina and relevant street-performing permits.',code:'2111'},
 'odour judge':{description:'Assesses the intensity and character of odours for sensory panels or environmental and product-testing work. Evaluations use specified samples, scoring methods and hygiene protocols.',tasks:['Smell controlled samples at scheduled intervals','Record intensity and quality ratings consistently','Follow sample handling and workplace safety procedures'],path:'Sensory-panel training, laboratory induction and careful documentation.',code:'2342'},
 'worm grunter':{description:'Uses ground vibrations to encourage earthworms to rise to the soil surface, usually for bait collection or demonstrations. It is generally seasonal or small-scale work.',tasks:['Choose suitable ground and weather conditions','Use vibration techniques without damaging habitat','Collect and handle worms responsibly'],path:'Hands-on experience in outdoor bait collection and local wildlife rules.',code:'8419'},
 'iceberg mover':{description:'Helps plan or conduct specialised operations to move or manage drifting icebergs near maritime infrastructure. This work is rare and usually part of a broader marine engineering or vessel crew job.',tasks:['Monitor iceberg movement and sea conditions','Coordinate towing or hazard-mitigation plans','Apply marine safety and environmental procedures'],path:'Marine operations, engineering or vessel credentials; not typically a stand-alone job.',code:'2312'},
 'mermaid performer':{description:'Performs underwater or poolside as a mermaid character at shows, aquariums or events. Combines costume performance, breath control and careful aquatic safety.',tasks:['Rehearse and deliver aquatic routines','Maintain costume and equipment','Follow safety plans with rescue support'],path:'Strong swimming ability, water safety training and performance experience.',code:'2111'},
 'ghost hunter':{description:'Investigates reports of unusual experiences or purported paranormal activity, usually for entertainment, tourism or independently produced media. No scientific method has established ghosts as real.',tasks:['Interview witnesses and document site conditions','Set up cameras or recording equipment','Present findings accurately without claiming unverified proof'],path:'Media production, field documentation and site safety are relevant.',code:'2121'},
 'professional cuddler':{description:'Provides non-sexual, consent-based companionship through agreed platonic touch sessions where legally permitted. Boundaries, communication and client wellbeing are central.',tasks:['Agree on professional boundaries and consent','Maintain a safe session environment','Keep appointments, records and privacy safeguards'],path:'Training in communication, safeguarding and professional boundaries is important.',code:'4231'},
 'crime scene cleaner':{description:'Safely cleans and remediates locations contaminated by bodily fluids or hazardous material after emergency services have released the site. The role requires strong infection-control procedures.',tasks:['Assess contamination and prepare protective equipment','Remove hazardous waste using approved disposal methods','Disinfect, document and restore the site'],path:'Biohazard remediation, infection-control training and personal protective equipment competency.',code:'8112'},
 'stunt double':{description:'Performs carefully planned physical action on camera in place of an actor. The work includes falls, fights, driving or other specialist movements under stunt coordination.',tasks:['Rehearse action sequences with coordinators','Check protective equipment and filming safety','Perform repeatable movements for camera continuity'],path:'Advanced physical discipline, specialist stunt training and film set safety.',code:'2111'},
 'adult film performer':{description:'Works as an on-camera performer in legally permitted adult media productions. Contracts, performer consent, workplace health and protection of personal information are essential.',tasks:['Review production agreements and boundaries','Rehearse camera cues and coordinate with crew','Follow legal, health and privacy protocols'],path:'Performer skills, legal advice and knowledge of applicable adult-industry protections.',code:'2111'},
 'erotic fiction writer':{description:'Writes fiction for adult readers, developing characters, dialogue and narratives for print or digital publication. The work also involves revision, editing and distribution.',tasks:['Plan and draft stories in an agreed genre','Edit pacing, dialogue and manuscript quality','Manage submissions, contracts or self-publishing'],path:'Writing portfolio and publishing knowledge; no mandatory qualification.',code:'2122'},
 'exotic dancer':{description:'Performs choreographed dance in legally permitted adult-entertainment venues or productions. Fitness, stagecraft, consent and personal safety are important parts of the job.',tasks:['Develop and rehearse dance routines','Coordinate performance schedules','Follow venue rules, contracts and professional boundaries'],path:'Dance experience, fitness and awareness of local venue regulations.',code:'2111'},
 'intimacy coordinator':{description:'Works with film, television and theatre teams to plan intimate scenes, clarify boundaries and support consent through rehearsal and filming. Coordinates performers, directors and safety procedures.',tasks:['Discuss boundaries with performers privately','Choreograph and document agreed action','Monitor set protocols and resolve changes in consent'],path:'Specialised intimacy-coordination training and production-set experience.',code:'2123'},
 'adult entertainment producer':{description:'Plans and manages legally permitted adult-media productions, coordinating budgets, crews, scheduling, permissions and distribution.',tasks:['Organise production plans and budgets','Manage performer consent and legal documentation','Supervise editing, publishing and delivery'],path:'Media production and business experience plus jurisdiction-specific compliance.',code:'2121'},
 'sexual wellness educator':{description:'Provides educational information about sexual health, consent, relationships and wellbeing within their professional scope. May develop workshops or resources for community and adult audiences.',tasks:['Develop age-appropriate educational materials','Explain evidence-based health information','Refer specialised clinical questions to qualified providers'],path:'Relevant health education training and safeguarding expertise.',code:'2725'},
 'erotic photographer':{description:'Plans and produces adult-oriented photographic work with agreed creative direction and consent. Also manages lighting, retouching, intellectual property and image privacy.',tasks:['Plan shoots with models and clients','Set lighting and capture agreed images','Edit work and protect consent records and distribution rights'],path:'Professional photography portfolio, production safety and contract knowledge.',code:'2113'},
 'adult entertainment venue manager':{description:'Oversees day-to-day operations of a legally permitted adult-entertainment venue, including staffing, customer service, financial records, licensing and safeguarding.',tasks:['Coordinate shifts, service and venue operations','Maintain regulatory and safety documentation','Resolve operational and customer-service issues'],path:'Hospitality management experience and required local licences.',code:'1419'},
 'online adult performer':{description:'Creates live or recorded adult entertainment for online audiences where lawful. Work may involve camera operation, scheduling, platform rules and protection of identity and data.',tasks:['Manage production and broadcasting equipment','Set boundaries, contracts and privacy safeguards','Monitor platform compliance and audience interactions'],path:'Production, digital platform management and legal and personal safety knowledge.',code:'2111'}
});
const families=[
 [/anaesthet|anesthesi/i,'Provides anaesthesia and manages patient wellbeing around surgery and medical procedures.','Assess patients, plan anaesthesia, and monitor vital signs during procedures.','Specialist medical degree, registration and postgraduate training.'],
 [/surgeon|surgical|neurosurg|cardiothoracic/i,'Performs specialist surgical work, including diagnosis, planning, operating procedures and postoperative care.','Review scans and clinical findings; perform surgery with a clinical team; manage recovery and complications.','Medical degree, registration and many years of specialist surgical training.'],
 [/cardiolog|physician|doctor|radiolog|dentist|medical/i,'Diagnoses and treats patients using specialist clinical knowledge, assessments and care plans.','Assess patients, interpret tests and records, communicate treatment options and monitor outcomes.','Accredited health qualification and Australian registration where required.'],
 [/software|developer|programmer|coder|mobile app/i,'Builds and maintains digital systems, translating specifications into working, testable software.','Write and review code, investigate bugs, test releases and work with designers and users.','Software engineering, computer science or equivalent practical experience.'],
 [/security|cyber|forensic analyst/i,'Investigates risks, protects systems and identifies weaknesses in digital or physical security.','Analyse incidents, assess vulnerabilities, document controls and recommend safeguards.','Relevant technical or security training and industry certifications.'],
 [/data|analyst|research|scientist/i,'Studies information to answer questions, test hypotheses and improve decisions.','Clean and interpret evidence, run analyses, prepare reports and explain findings to stakeholders.','Relevant degree, research training or demonstrated analytical capability.'],
 [/machine|mechanic|welder|fabricator|technician|assembler|operator/i,'Operates, services or builds specialised equipment in a production or technical environment.','Follow work orders, operate tools safely, check output quality and troubleshoot faults.','Trade training, site induction or job-specific equipment certification.'],
 [/pilot|aviation|flight|aircraft/i,'Operates or supports aircraft and flight operations, with safety checks and strict procedural requirements.','Plan routes, review conditions, coordinate with control teams and maintain safety records.','Aviation licences, medical fitness and recurrent checks depending on the role.'],
 [/teacher|tutor|professor|lecturer|trainer/i,'Plans and delivers learning sessions, helping students build skills and demonstrate understanding.','Prepare lessons, explain concepts, assess progress and adjust support to learner needs.','Relevant teaching or vocational qualification; registration where required.'],
 [/engineer|architect/i,'Designs and improves systems or infrastructure using analysis, testing and technical constraints.','Develop designs, evaluate safety and cost, coordinate teams and review technical performance.','Engineering or architecture qualifications and professional accreditation where applicable.'],
 [/designer|artist|photograph|animat|director|producer|editor/i,'Develops and produces creative work for an audience, client or production team.','Research the brief, create concepts, refine drafts and deliver finished work to technical standards.','Portfolio and creative skills; relevant tertiary or production training can help.'],
 [/chef|cook|baker|barista|food|kitchen|cater/i,'Prepares or coordinates food and beverage service while following hygiene and quality standards.','Prepare ingredients, handle equipment, maintain safe food storage and deliver orders.','Hospitality training, food-safety knowledge or an apprenticeship depending on the role.'],
 [/housekeeper|cleaner|bed|laundry|hotel|concierge/i,'Maintains guest, care or accommodation spaces to defined presentation, hygiene and service standards.','Prepare spaces, replenish supplies, track defects and coordinate with the facilities team.','Workplace hygiene induction and on-the-job practical training.'],
 [/transport|driver|courier|logistic|warehouse|delivery/i,'Moves goods, vehicles or information through a transport and distribution workflow.','Coordinate schedules, track deliveries, carry out safe handling and keep records accurate.','Relevant licence, logistics training or safety credentials depending on tasks.'],
 [/farmer|animal|forest|ranger|garden|marine|environment/i,'Works with land, plants, animals or ecosystems in production, care or conservation.','Monitor conditions, maintain equipment or habitats, record observations and follow safety requirements.','Relevant practical experience or agricultural, environmental or animal-care qualifications.'],
 [/lawyer|barrister|legal|solicitor/i,'Provides legal advice and representation, researches legislation and prepares documents or submissions.','Review evidence, research law, draft legal material and communicate with clients.','Accredited law degree and admission or practising certificate as applicable.'],
 [/account|auditor|finance|investment|trader|econom/i,'Works with financial information, transactions or decisions, assessing costs, risk and returns.','Analyse financial data, prepare records, advise stakeholders and check compliance.','Finance, accounting or economics training and relevant professional registration.'],
 [/manager|director|chief|supervisor|head/i,'Coordinates people, operations and resources to deliver organisational objectives.','Set priorities, manage budgets, coach teams and review performance and risks.','Industry experience, leadership capability and role-specific qualifications.'],
 [/construction|carpenter|plumber|electrician|roofer|builder|bricklayer/i,'Builds, installs or maintains structures and trade systems to drawings and safety requirements.','Interpret plans, prepare materials, use tools, inspect work and meet building standards.','Trade apprenticeship and licences or safety certificates as required.'],
 [/waiter|restaurant|bartender|server|runner/i,'Supports food, drink or guest services during customer-facing shifts.','Prepare service areas, deliver orders, communicate requests and maintain hygiene.','Customer-service experience, food safety and responsible-service qualifications where needed.'],
 [/coach|sport|fitness|trainer|swim|lifeguard/i,'Supports sport, recreation or physical activity through instruction, performance or supervision.','Plan sessions, assess safety, develop skills and monitor progress.','Coaching qualifications, first aid or sporting accreditation where required.'],
 [/hair|makeup|beauty|stylist|barber|massage/i,'Provides personal-care, grooming or appearance services using specialised techniques.','Consult clients, prepare tools, perform treatments and maintain hygienic practices.','Vocational qualifications and applicable registration or hygiene certification.']
];
const sectorCopy={
 'Technology & data':['Delivers technical work involving software, information systems or digital services.','Test and improve technical work; maintain documentation; coordinate with users and teammates.','Technical training, portfolio or relevant qualification.'],
 'Health & medicine':['Supports patient care or medical services within the limits of the role.','Apply clinical procedures, communicate care information and follow safety protocols.','Appropriate health training and professional registration where required.'],
 'Engineering':['Produces, maintains or improves equipment and technical work.','Follow specifications, monitor quality and handle equipment safely.','Technical qualification, trade training or supervised workplace experience.'],
 'Business & finance':['Supports decisions, service delivery and operations within an organisation.','Manage records, coordinate work and report results to stakeholders.','Commercial experience, vocational training or tertiary study as relevant.'],
 'Law & government':['Performs public, regulatory or legal work within established procedures.','Review information, follow regulations and communicate decisions clearly.','Sector-specific qualification, training or clearance.'],
 'Arts & media':['Creates, edits or delivers work for a creative or media project.','Develop concepts, work to a brief and meet production deadlines.','A portfolio and demonstrated technical or creative skill.'],
 'Education & research':['Supports learning, evidence gathering or specialist research.','Prepare materials, analyse information and document findings.','Relevant academic or practical training.'],
 'Construction & trades':['Installs, builds or maintains assets to a defined specification.','Prepare work areas, follow plans and use tools safely.','Trade or site-specific training and licences.'],
 'Food & hospitality':['Prepares services or goods for customers, guests or workplaces.','Set up work areas, handle requests and maintain service standards.','Service training and relevant safety certificates.'],
 'Transport & logistics':['Coordinates or performs movement of people, goods or transport assets.','Monitor schedules, handle equipment and keep accurate records.','Relevant licences, safe-handling and operational training.'],
 'Nature & agriculture':['Works with living systems, environmental resources or outdoor operations.','Monitor conditions, maintain resources and follow welfare or safety requirements.','Practical experience and relevant technical training.'],
 'Sport & recreation':['Provides activity, sport or recreation services.','Prepare sessions, supervise participants and monitor safety.','Sporting, first-aid or instructional accreditation.'],
 'Personal services':['Provides a specialised personal or customer service.','Prepare materials, assess client requirements and maintain hygiene.','Relevant vocational training or practical skills.'],
 'Adult industry':['Performs legally permitted adult-industry work and related production or customer services.','Coordinate content or services; protect privacy, consent and workplace safety.','Legal compliance, production skills and workplace protocols.'],
 'Unusual & niche':['Carries out a specialised service or task in a niche work setting.','Use site-specific methods, track results and follow relevant safety procedures.','Practical supervised training relevant to the particular role.'],
 'Other':['Performs a defined set of operational or specialist tasks for an employer or customer.','Follow work instructions, coordinate with colleagues and document completed work.','Training and experience specific to the employer and role.']
};
// Where public occupation descriptions do not cover an exact title, derive a
// useful but explicitly inferred overview from its occupational function.
// This is not presented as an independently verified job description.
const titleActions=[
 [/\binspector\b/i,['Inspects','for defects, safety concerns and compliance with specifications',['Inspect samples or completed work against standards','Record faults and corrective actions','Communicate findings to the production or service team']]],
 [/\b(?:machine )?operator|operative\b/i,['Operates and monitors','equipment or processes, setting controls and checking output',['Prepare tools or machinery for the assigned process','Monitor output and adjust settings safely','Record performance, defects and maintenance needs']]],
 [/\b(?:supervisor|foreman|forewoman|superintendent)\b/i,['Oversees','teams and work processes, allocating tasks and checking production, service and safety',['Organise shifts and work assignments','Check work quality and safety requirements','Report progress and resolve operational delays']]],
 [/\b(?:director|head of|chief officer)\b/i,['Leads','a department or programme, setting objectives and managing budgets, delivery and staff',['Set strategic priorities and budgets','Coordinate staff and specialist teams','Review performance and major risks']]],
 [/\bmanager\b/i,['Manages','operations and staff, coordinating plans, budgets, service quality and day-to-day decisions',['Plan operations and resources','Lead teams and coordinate stakeholders','Monitor quality, budgets and performance']]],
 [/\b(?:engineer|engineering professional)\b/i,['Designs, tests and improves','technical systems and processes, balancing performance, safety and cost',['Develop and review technical designs','Test and troubleshoot systems or processes','Document specifications and safety decisions']]],
 [/\b(?:scientist|biologist|physicist|chemist|researcher)\b/i,['Investigates','using experiments, fieldwork or data analysis to produce evidence-based findings',['Design investigations or analytical methods','Collect and interpret data or specimens','Report research outcomes and limitations']]],
 [/\b(?:professor|lecturer|faculty member|teacher|tutor)\b/i,['Teaches and develops learning in','planning instruction, assessment and, where relevant, research',['Prepare lessons, materials or lectures','Assess and support learners','Keep subject knowledge and teaching practice current']]],
 [/\b(?:consultant|adviser|advisor)\b/i,['Advises clients or organisations on','analysing needs and recommending practical options',['Assess client or organisational needs','Evaluate options and give recommendations','Prepare advice, plans and records']]],
 [/\b(?:designer|decorator|illustrator|stylist)\b/i,['Creates and refines','designs, concepts or presentation work to a brief',['Research the design brief and requirements','Develop concepts and production-ready work','Revise designs based on feedback and practical limits']]],
 [/\b(?:technician|fitter|repairer|mechanic)\b/i,['Installs, checks, fits or repairs','equipment and components using practical diagnostic methods',['Inspect equipment and identify faults','Assemble, adjust or repair parts','Test finished work and document safety checks']]],
 [/\b(?:tender|feeder|loader|puller)\b/i,['Feeds, moves or monitors','materials in a production or handling process',['Prepare and supply materials to a workstation','Monitor feed rates or handling quality','Follow safe manual-handling and machine procedures']]],
 [/\b(?:grader|sorter|checker|assessor)\b/i,['Checks and classifies','against defined quality grades, records and specifications',['Examine items or information against criteria','Sort or mark items by quality or category','Record exceptions and report defects']]],
 [/\b(?:seller|salesperson|sales representative|shop assistant)\b/i,['Sells and advises customers about','products or services, matching customer needs to available options',['Explain product or service features','Process customer orders or sales','Maintain product knowledge and stock information']]],
 [/\b(?:writer|author|editor|journalist|reporter)\b/i,['Researches, writes or edits','content for publication or an audience, checking tone, accuracy and format',['Develop a brief and research information','Draft or edit material to publication standards','Revise work for clarity and factual accuracy']]],
 [/\b(?:clerk|administrator|coordinator|secretary)\b/i,['Coordinates records and administrative work in','handling correspondence, systems and workplace requests',['Maintain accurate records and schedules','Process requests and prepare documentation','Communicate updates to colleagues or clients']]],
 [/\b(?:nurse|therapist|practitioner|physician|doctor)\b/i,['Provides care or professional services in','assessing needs, planning support and documenting outcomes',['Assess clients or patients within professional scope','Deliver appropriate services and monitor progress','Maintain clinical records and safety procedures']]],
 [/\b(?:artist|animator|performer|musician|dancer)\b/i,['Develops and performs creative work in','rehearsing, producing and refining material for audiences',['Plan and rehearse creative work','Use appropriate tools or performance techniques','Deliver and review final output']]],
 [/\b(?:driver|pilot|captain|navigator)\b/i,['Operates transport or navigation services involving','planning routes, inspecting equipment and coordinating safe journeys',['Check equipment and route conditions','Carry out operations to safety standards','Keep logs and communicate with dispatch or control teams']]],
 [/\b(?:packer|assembler|stitcher|sewer|cutter|molder|moulder|caster)\b/i,['Prepares or assembles','materials and products to technical or quality specifications',['Prepare materials and tools','Follow the assembly or processing sequence','Inspect output and correct defects']]],
 [/\b(?:cleaner|maid|housekeeper)\b/i,['Cleans and maintains','facilities or equipment to hygiene and presentation standards',['Prepare cleaning supplies and the work area','Clean and inspect assigned spaces','Handle waste and chemicals safely']]],
 [/\b(?:apprentice|trainee|intern)\b/i,['Learns and assists with','work under supervision while developing practical skills and safety knowledge',['Complete assigned supervised tasks','Follow workplace safety instructions','Record progress and develop technical skills']]],
 [/\b(?:specialist|expert)\b/i,['Provides specialised support in','applying technical or professional knowledge to difficult problems',['Evaluate specialised requests or cases','Apply relevant methods and procedures','Explain outcomes and maintain records']]],
 [/\b(?:worker|attendant|assistant|aide)\b/i,['Assists with practical work in','supporting daily operations, equipment or people',['Prepare materials and work areas','Complete assigned operational tasks','Report issues and follow safety procedures']]]
];
function titledOverview(title){
 for(const [pattern,[verb,finish,tasks]] of titleActions){
  if(!pattern.test(title))continue;
  const area=title.replace(pattern,'').replace(/\b(senior|junior|graduate|entry.level|trainee|lead|principal|apprentice)\b/ig,'').replace(/\s+/g,' ').trim();
  if(!area||area.length>95)continue;
  const focus=area.toLowerCase();
  const detail={
   'Inspects':`Inspects ${focus} products or work for defects, safety concerns and compliance with specifications.`,
   'Operates and monitors':`Operates and monitors equipment used for ${focus} processes, setting controls and checking output.`,
   'Oversees':`Oversees ${focus} teams and processes, allocating tasks and checking quality and safety.`,
   'Leads':`Leads ${focus} operations, setting objectives and managing budgets, delivery and staff.`,
   'Manages':`Manages ${focus} operations and staff, coordinating plans, budgets, service quality and day-to-day decisions.`,
   'Designs, tests and improves':`Designs, tests and improves ${focus} systems or processes, balancing performance, safety and cost.`,
   'Investigates':`Investigates ${focus} through experiments, fieldwork or data analysis and reports evidence-based findings.`,
   'Teaches and develops learning in':`Teaches ${focus}, preparing instruction, assessment and, where relevant, research.`,
   'Advises clients or organisations on':`Advises clients or organisations about ${focus}, assessing their needs and recommending practical options.`,
   'Creates and refines':`Creates and refines ${focus} concepts or designs to a client or production brief.`,
   'Installs, checks, fits or repairs':`Installs, checks, fits or repairs ${focus} equipment or components using practical diagnostic methods.`,
   'Feeds, moves or monitors':`Feeds, moves or monitors ${focus} materials in a production or handling process.`,
   'Checks and classifies':`Checks and classifies ${focus} items against defined quality grades, records and specifications.`,
   'Sells and advises customers about':`Sells and advises customers about ${focus} products or services, matching needs to available options.`,
   'Researches, writes or edits':`Researches, writes or edits ${focus} content for publication, checking tone, accuracy and format.`,
   'Coordinates records and administrative work in':`Coordinates records and administrative work for ${focus} operations, handling correspondence, systems and requests.`,
   'Provides care or professional services in':`Provides care or professional services involving ${focus}, assessing needs, planning support and documenting outcomes.`,
   'Develops and performs creative work in':`Develops and performs creative work in ${focus}, rehearsing and refining material for audiences.`,
   'Operates transport or navigation services involving':`Operates transport or navigation services involving ${focus}, planning routes and monitoring conditions.`,
   'Prepares or assembles':`Prepares or assembles ${focus} materials and products to technical specifications.`,
   'Cleans and maintains':`Cleans and maintains ${focus} facilities or equipment to hygiene and presentation standards.`,
   'Learns and assists with':`Learns and assists with ${focus} work under supervision while developing safety knowledge and practical skills.`,
   'Provides specialised support in':`Provides specialised support in ${focus}, applying professional knowledge to difficult problems.`,
   'Assists with practical work in':`Assists with practical work in ${focus}, supporting daily operations, equipment or people.`
  }[verb]||`${verb} ${focus} ${finish}.`;
  return {description:detail+' The precise duties and equipment depend on the workplace.',tasks};
 }
 return null;
}
const GROUP_ALIAS=[
 [/anaesthet|anesthesi/i,'2532'],[/neurosurg|cardiothoracic|orthopaedic surgeon|vascular surgeon|surgeon/i,'2535'],
 [/cardiolog|physician|radiolog|medical director|nuclear medicine/i,'2533'],[/dental|dentist|orthodon/i,'2523'],
 [/mining engineer|petroleum engineer|drilling engineer/i,'2336'],[/chief technology|chief information|cybersecurity director|ict manager/i,'1351'],
 [/engineering director|engineering manager|engineering lead/i,'1332'],[/construction director|construction manager/i,'1331'],
 [/barrister/i,'2711'],[/airline captain|commercial pilot|airline pilot/i,'2311'],
 [/\b(software (engineer|developer|programmer|architect)|application developer|app engineer|programmer|web developer)\b/i,'2613'],[/data scientist|ai research|machine learning/i,'2249'],
 [/chef|pastry chef/i,'3513'],[/registered nurse|nurse practitioner/i,'2544'],[/firefighter|fire fighter/i,'4412'],
 [/electrician|electrical tradesperson/i,'3411'],[/carpenter|joiner/i,'3312'],[/plumber|gasfitter/i,'3341'],
 [/photographer|photojournalist/i,'2113'],[/vet|veterinary surgeon/i,'2347'],
 [/accountant|financial accountant/i,'2211'],[/graphic designer|digital designer/i,'2324'],
 [/primary school teacher/i,'2412'],[/secondary school teacher|high school teacher/i,'2414'],
 [/software architect|cloud architect/i,'2613'],[/civil engineer/i,'2332'],[/housekeep|bed setter/i,'8114'],
 [/food runner|mixed runner|waiter/i,'4315'],[/mail deliverer|postal delivery|postal worker|mail carrier|postman|postwoman/i,'5612'],[/delivery driver|parcel deliverer|courier driver/i,'7321'],[/adult content|film performer|erotic photographer/i,'2123']
];
let cataloguePromise;
export async function catalogue(){
 if(cataloguePromise)return cataloguePromise;
 cataloguePromise=(async()=>{
 const files=await Promise.all([ 'additional-titles.json','au-occupations.json','esco-descriptions.json'].map(async name=>{
  try{const r=await fetch(path(name));return r.ok?await r.json():[]}catch{return []}
 }));
 const [raw,au,esco]=files;
 const seen=new Map();
 for(const title of [...raw,...au.map(x=>x.title),...esco.map(x=>x.title),...LEGENDARY,...EPIC,...RARE,...EXTRAS]){
  if(typeof title!=='string')continue;const clean=title.trim();if(!clean||clean.length>95)continue;
  const key=clean.toLowerCase();if(!seen.has(key))seen.set(key,{title:clean,lower:key,category:industry(clean)});
 }
 const jobs=Array.from(seen.values()).sort((a,b)=>a.title.localeCompare(b.title,'en'));
 const auMap=new Map(),byCode=new Map(),escoMap=new Map();
 for(const row of au){byCode.set(row.code,row);for(const k of [norm(row.title),short(row.title),singular(row.title)])if(k&&!auMap.has(k))auMap.set(k,row)}
 for(const row of esco){for(const k of [norm(row.title),short(row.title),singular(row.title)])if(k&&!escoMap.has(k))escoMap.set(k,row)}
 const groups=au.filter(x=>x.code?.length===4&&Number.isFinite(x.weekly));
 const benchmarks={};for(const c of CATEGORIES.slice(1)){
  const arr=groups.filter(x=>industry(x.title)===c).map(x=>x.weekly*52).sort((a,b)=>a-b);
  benchmarks[c]=arr.length>3?arr[Math.floor(arr.length*.5)]:null;
 }
 return {jobs,byTitle:new Map(jobs.map(x=>[x.lower,x])),au,byCode,auMap,escoMap,benchmarks,groupMed:groups.map(x=>x.weekly*52).sort((a,b)=>a-b)[Math.floor(groups.length/2)]};
 })();return cataloguePromise;
}
function roleMatch(title,data){
 const exact=data.auMap.get(norm(title))||data.auMap.get(short(title))||data.auMap.get(singular(title));if(exact)return {row:exact,kind:'direct'};
 const alias=GROUP_ALIAS.find(([test,code])=>test.test(title)&&data.byCode.has(code));
 if(alias)return {row:data.byCode.get(alias[1]),kind:'comparable'};
 return null;
}
const seniority=title=>/\b(chief|head of|managing director|vice president|partner|director)\b/i.test(title)?1.55:/\b(principal|senior|lead|specialist|expert)\b/i.test(title)?1.22:/\b(junior|graduate|entry.level|trainee|apprentice|intern)\b/i.test(title)?.74:1;
// Specialist/executive titles lack reliable job-specific published medians.
// These explicit modelled comparisons are displayed with LOW confidence and a wide range.
const executiveModels = {
 'quantitative trader':['2222',1.50],
 'private equity partner':['2223',1.90],
 'investment banking managing director':['2222',2.00],
 'chief executive officer':['1321',1.60],
 'chief investment officer':['2223',1.80],
 'chief financial officer':['1322',1.50],
 'chief operating officer':['1321',1.55],
 'commodities trading director':['2222',1.60],
 'investment fund manager':['2223',1.40]
};
function rangeEstimate(mid,pct){return [Math.max(30000,Math.round(mid*(1-pct)/5000)*5000),Math.round(mid*(1+pct)/5000)*5000]}
function splitTasks(s){return s.split(';').map(x=>x.trim()).filter(Boolean)}
export async function profile(title){
 const data=await catalogue();
 const found=roleMatch(title,data),code=found?.row.code;
 const group=code?.length===6?data.byCode.get(code.slice(0,4)):found?.row;
 const executive=executiveModels[title.toLowerCase()];
 const official=!executive&&found?.kind==='direct' && Number.isFinite(group?.weekly);
 const matchPay=Number.isFinite(group?.weekly)?group.weekly*52:null;
 const cat=industry(title),mod=seniority(title),specialInfo=special[norm(title)];
 const specialGroup=specialInfo?.code?data.byCode.get(specialInfo.code):null;
 const benchmark=data.benchmarks[cat]||data.groupMed||84000;
 let median,range,confidence,basis,payType;
 if(executive&&Number.isFinite(data.byCode.get(executive[0])?.weekly)){const comp=data.byCode.get(executive[0]);median=comp.weekly*52*executive[1];range=rangeEstimate(median,.42);confidence='Low (executive / specialist extrapolation)';payType='MODELLED AUSTRALIAN ESTIMATE';basis='Indicative extrapolation from the JSA median for '+comp.title+' (ANZSCO '+comp.code+') with a specialist or executive uplift; actual upper-end remuneration varies widely and is not reliably captured by the group median.'}
 else if(official){median=matchPay;range=rangeEstimate(median,.23);confidence='High (occupation-group match)';payType='OFFICIAL GROUP MEDIAN';basis='ABS May 2025 full-time weekly median for '+group.title+' (ANZSCO '+group.code+'), annualised ×52. Range is indicative, not an official percentile interval.'}
 else if(matchPay){median=matchPay*mod;range=rangeEstimate(median,.3);confidence='Medium (comparable occupation)';payType='MODELLED AUSTRALIAN ESTIMATE';basis='Based on Australian occupation-group median for '+group.title+' (ANZSCO '+group.code+') with a role-level adjustment. Not an official figure for this title.'}
 else if(Number.isFinite(specialGroup?.weekly)){median=specialGroup.weekly*52*mod;range=rangeEstimate(median,.34);confidence='Medium-low (role-family comparison)';payType='MODELLED AUSTRALIAN ESTIMATE';basis='Based on Australian pay data for '+specialGroup.title+' (ANZSCO '+specialGroup.code+'); specialist or contract earnings may differ substantially.'}
 else{median=benchmark*mod;range=rangeEstimate(median,.42);confidence='Low (industry benchmark)';payType='MODELLED AUSTRALIAN ESTIMATE';basis='Broad ANZSCO industry benchmark and title seniority only; this niche title has no verified salary match. The range is illustrative.'}
 median=Math.round(median/1000)*1000;
 // A contractor or unusual activity is not necessarily a standard year-round occupation.
 const titleText=title.toLowerCase();const esco=data.escoMap.get(norm(title))||data.escoMap.get(short(title))||data.escoMap.get(singular(title));
 let description,descriptionSource,tasks,pathway,context;
 if(specialInfo){description=specialInfo.description;descriptionSource='Curated, title-specific occupational overview';tasks=specialInfo.tasks;pathway=specialInfo.path}
 else if(found?.kind==='direct'&&found.row.description){description=found.row.description;descriptionSource='Jobs and Skills Australia / ANZSCO';}
 else if(esco?.description){description=esco.description;descriptionSource='ESCO European occupation description';}
 else if(found?.row.description){description=found.row.description;descriptionSource='Comparable Australian ANZSCO occupation group';}
 if(!tasks){const family=families.find(([re])=>re.test(title))||[null,...(sectorCopy[cat]||sectorCopy.Other)];const inferred=titledOverview(title);
  if(!description){description=inferred?.description||family[1]+' This title does not have a verified Australian occupation definition; duties should be confirmed with a relevant employer.';descriptionSource='Occupation-family overview inferred from job title';}
  tasks=inferred?.tasks||splitTasks(family[2]);pathway=family[3];
 }
 if(tasks.length<3){const rest=(sectorCopy[cat]||sectorCopy.Other)[1].split(';').map(x=>x.trim());tasks=[...tasks,...rest].slice(0,3)}
 context=cat==='Food & hospitality'?'Accommodation, catering and service workplaces':cat==='Technology & data'?'Technology companies, public-sector teams and in-house IT':cat==='Health & medicine'?'Hospitals, clinics and specialist practices':cat==='Engineering'?'Technical offices, worksites and industrial facilities':cat==='Construction & trades'?'Construction sites, workshops and client premises':cat==='Nature & agriculture'?'Outdoor sites, field stations, farms and conservation areas':cat==='Arts & media'?'Studios, agencies, production teams or freelance':cat==='Education & research'?'Schools, campuses, laboratories and research teams':cat==='Transport & logistics'?'Transport networks, depots and distribution operations':cat==='Business & finance'?'Offices, financial institutions and consulting teams':cat==='Adult industry'?'Legally permitted production, digital or venue operations':'Work settings vary by employer and specialisation';
 const tier=tierFor(title,data);
 return {title,cat,tier,description,descriptionSource,tasks,pathway,context,annual:median,lo:range[0],hi:range[1],official,confidence,basis,payType,group:group?.title||null,source:official||matchPay?'https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles':'https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles',sources:['https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles','https://esco.ec.europa.eu/en'],hours:'Full-time annualised equivalent; actual hours and availability vary',lastUpdated:'Source period May 2025; estimates are indicative'};
}
const leg=new Set(LEGENDARY.map(x=>x.toLowerCase()));const epic=new Set(EPIC.map(x=>x.toLowerCase()));const rare=new Set(RARE.map(x=>x.toLowerCase()));
export function tierFor(title,data){const key=title.toLowerCase();if(leg.has(key))return 'legendary';if(epic.has(key))return 'epic';if(rare.has(key))return 'rare';
 if(/\b(chief|surgeon|medical director|partner|president|vice president|principal mining|head of)\b/i.test(title)&&/\b(physician|medicine|engineer|finance|technology|medical|investment|surgery|research)\b/i.test(title))return 'rare';
 if(/\b(architect|physician|aerospace|scientist|cybersecurity|senior engineer|designer|specialist|professor|analyst|actuary|pilot|orthodont|solicitor|geologist|director|research scientist)\b/i.test(title))return 'uncommon';
 if(industry(title)==='Unusual & niche')return 'uncommon';return 'common';
}
const poolCache=new Map();
export async function pools(){const data=await catalogue();if(poolCache.has(data))return poolCache.get(data);
 const grouped={common:[],uncommon:[],rare:[],epic:[],legendary:[]};
 for(const job of data.jobs)grouped[tierFor(job.title,data)].push(job.title);
 // Preserve every title in exactly one tier; no duplicates or missing entries.
 poolCache.set(data,grouped);return grouped;
}
export function savedJobs(){try{return new Set(JSON.parse(localStorage.getItem('oj-saved-v2')||localStorage.getItem('oddjobs-saved')||'[]'))}catch{return new Set()}}
export function toggleSave(title){const set=savedJobs();if(set.has(title))set.delete(title);else set.add(title);try{localStorage.setItem('oj-saved-v2',JSON.stringify([...set]))}catch{}return set.has(title)}
export function roleUrl(title){return './job.html?role='+encodeURIComponent(title)}
export function navActive(){const pathname=location.pathname.split('/').pop()||'index.html';for(const el of document.querySelectorAll('[data-nav]'))el.classList.toggle('active',el.getAttribute('data-nav')===pathname)}
export function updateCount(n){for(const el of document.querySelectorAll('[data-job-count]'))el.textContent=new Intl.NumberFormat('en-AU').format(n)}
export function attachSaveButtons(root=document){for(const el of root.querySelectorAll('[data-save]')){const title=el.getAttribute('data-save');el.textContent=savedJobs().has(title)?'♥ Saved':'♡ Save';el.onclick=()=>{toggleSave(title);el.textContent=savedJobs().has(title)?'♥ Saved':'♡ Save';el.dispatchEvent(new CustomEvent('savechanged',{bubbles:true}))}}}
