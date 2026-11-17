import json
import os

curriculum_data = {
    "schema_version": "1.0.0",
    "curriculum": {
        "id": "ethiopian-national-secondary-curriculum",
        "name": "Ethiopian Secondary Education Curriculum (Grades 9–12)",
        "country_code": "ET",
        "language": "en",
        "source_documents": [
            {
                "id": "moe-ethiopia-curriculum-framework-2023",
                "filename": "Ethiopian Ministry of Education National Curriculum Framework",
                "grade": 12,
                "subject_id": "general",
                "document_type": "syllabus"
            }
        ],
        "grades": []
    }
}

# Master syllabus dictionary of all grades, subjects, units, and chapters
GRADE_DATA = {
    9: {
        "biology": {
            "name": "Biology",
            "units": [
                {
                    "title": "Introduction to Biology",
                    "chapters": [
                        "1.1 Definition of Biology",
                        "1.2 Why do we study Biology?",
                        "1.3 The Scientific Method",
                        "1.4 Tools of a Biologist",
                        "1.5 The Light Microscope",
                        "1.6 General Laboratory Safety Rules"
                    ]
                },
                {
                    "title": "Characteristics and Classification of Organisms",
                    "chapters": [
                        "2.1 Characteristics of Living Things",
                        "2.2 Taxonomy of Living Things",
                        "2.3 Relevance of Classification",
                        "2.4 Linnaean System of Nomenclature",
                        "2.5 Common Ethiopian Animals and Plants",
                        "2.6 The Five-Kingdom System of Classification",
                        "2.7 Renowned Taxonomists in Ethiopia"
                    ]
                },
                {
                    "title": "Cells",
                    "chapters": [
                        "3.1 What is a Cell?",
                        "3.2 Cell Theory",
                        "3.3 Cell Structure and Function",
                        "3.4 Types of Cells",
                        "3.5 Animal and Plant Cells",
                        "3.6 Observing Cells Under a Microscope",
                        "3.7 The Cell and its Environment",
                        "3.8 Levels of Biological Organization"
                    ]
                },
                {
                    "title": "Reproduction",
                    "chapters": [
                        "4.1 Introduction to Reproduction",
                        "4.2 Asexual Reproduction and its Types",
                        "4.3 Sexual Reproduction in Humans",
                        "4.4 Primary and Secondary Sexual Characteristics",
                        "4.5 Male Reproductive Structures",
                        "4.6 Female Reproductive Structures",
                        "4.7 The Menstrual Cycle",
                        "4.8 Fertilization and Pregnancy",
                        "4.9 Methods of Birth Control",
                        "4.10 Sexually Transmitted Infections (STIs)"
                    ]
                },
                {
                    "title": "Human Health, Nutrition, and Disease",
                    "chapters": [
                        "5.1 What is Food and Nutrition?",
                        "5.2 Balanced Diets and Nutrients",
                        "5.3 Deficiency Diseases and Malnutrition",
                        "5.4 Substance Abuse",
                        "5.5 Infectious and Non-infectious Diseases"
                    ]
                },
                {
                    "title": "Ecology",
                    "chapters": [
                        "6.1 Ecological Concepts and Terms",
                        "6.2 Biotic and Abiotic Components",
                        "6.3 Energy Flow in Ecosystems",
                        "6.4 Biogeochemical Cycles",
                        "6.5 Biomes and Wildlife of Ethiopia"
                    ]
                }
            ]
        },
        "chemistry": {
            "name": "Chemistry",
            "units": [
                {
                    "title": "Chemistry and Its Importance",
                    "chapters": [
                        "1.1 Definition and Scope of Chemistry",
                        "1.2 Relationship Between Chemistry and Other Sciences",
                        "1.3 Role of Chemistry in Production and Society",
                        "1.4 Common Chemical Industries in Ethiopia"
                    ]
                },
                {
                    "title": "Measurements and Scientific Methods",
                    "chapters": [
                        "2.1 Measurements and Units in Chemistry",
                        "2.2 Uncertainty in Measurements and Significant Figures",
                        "2.3 Chemistry as an Experimental Science",
                        "2.4 Laboratory Safety Procedures"
                    ]
                },
                {
                    "title": "Structure of the Atom",
                    "chapters": [
                        "3.1 Historical Development of the Atomic Model",
                        "3.2 Fundamental Laws of Chemical Reactions",
                        "3.3 Dalton's Atomic Theory",
                        "3.4 Discovery of Subatomic Particles",
                        "3.5 Composition of an Atom and Isotopes"
                    ]
                },
                {
                    "title": "Periodic Classification of the Elements",
                    "chapters": [
                        "4.1 Historical Development of the Periodic Table",
                        "4.2 Modern Periodic Law and Layout",
                        "4.3 Classification of Elements (Metals, Non-metals, Metalloids)",
                        "4.4 Periodic Trends in Atomic Properties"
                    ]
                },
                {
                    "title": "Chemical Bonding",
                    "chapters": [
                        "5.1 Chemical Bonding and Octet Rule",
                        "5.2 Ionic Bonding and Properties of Ionic Compounds",
                        "5.3 Covalent Bonding and Molecular Shapes",
                        "5.4 Metallic Bonding and Properties of Metals"
                    ]
                }
            ]
        },
        "mathematics": {
            "name": "Mathematics",
            "units": [
                {
                    "title": "Further on Sets",
                    "chapters": [
                        "1.1 Description of the Concept of Set",
                        "1.2 Notion of Set and Notations",
                        "1.3 Operations on Sets (Union, Intersection, Difference, Complement)",
                        "1.4 Application of Operations on Sets and Venn Diagrams"
                    ]
                },
                {
                    "title": "The Number System",
                    "chapters": [
                        "2.1 Revision on Natural Numbers and Integers",
                        "2.2 Rational Numbers and Operations",
                        "2.3 Irrational Numbers and Properties",
                        "2.4 Real Numbers and the Real Line",
                        "2.5 Applications of the Real Number System"
                    ]
                },
                {
                    "title": "Solving Equations",
                    "chapters": [
                        "3.1 Revision of Linear Equations in One Variable",
                        "3.2 Systems of Linear Equations in Two Variables",
                        "3.3 Solving Non-linear Equations and Quadratic Equations",
                        "3.4 Some Applications of Solving Equations"
                    ]
                },
                {
                    "title": "Solving Inequalities",
                    "chapters": [
                        "4.1 Revision on Linear Inequalities in One Variable",
                        "4.2 Systems of Linear Inequalities in Two Variables",
                        "4.3 Inequalities Involving Absolute Value",
                        "4.4 Quadratic Inequalities",
                        "4.5 Applications on Inequalities"
                    ]
                },
                {
                    "title": "Introduction to Trigonometry",
                    "chapters": [
                        "5.1 Trigonometric Ratios (Sine, Cosine, Tangent)",
                        "5.2 Values of Trigonometric Ratios for Special Angles",
                        "5.3 Simple Trigonometric Identities",
                        "5.4 Practical Applications of Trigonometry"
                    ]
                },
                {
                    "title": "Regular Polygons and Circles",
                    "chapters": [
                        "6.1 Properties of Regular Polygons",
                        "6.2 Chords, Arcs, and Central Angles",
                        "6.3 Inscribed Angles and Cyclic Quadrilaterals",
                        "6.4 Tangents to a Circle"
                    ]
                }
            ]
        },
        "physics": {
            "name": "Physics",
            "units": [
                {
                    "title": "Physics and Human Society",
                    "chapters": [
                        "1.1 Definition and Nature of Physics",
                        "1.2 Branches of Physics",
                        "1.3 Related Fields to Physics",
                        "1.4 Historical Issues and Contributors to Physics"
                    ]
                },
                {
                    "title": "Physical Quantities and Measurement",
                    "chapters": [
                        "2.1 Scales, Standards, and Units (SI Prefixes)",
                        "2.2 Measurement and Safety in the Laboratory",
                        "2.3 Classification of Physical Quantities (Scalars & Vectors)",
                        "2.4 Unit Conversion and Dimensional Analysis"
                    ]
                },
                {
                    "title": "Motion in a Straight Line",
                    "chapters": [
                        "3.1 Position, Distance, and Displacement",
                        "3.2 Average Speed and Velocity",
                        "3.3 Acceleration and Uniform Motion Equations",
                        "3.4 Graphical Representation of Motion"
                    ]
                },
                {
                    "title": "Force, Work, Energy, and Power",
                    "chapters": [
                        "4.1 The Concept of Force and Newton's Laws",
                        "4.2 Work Done by Constant Forces",
                        "4.3 Kinetic and Potential Energy",
                        "4.4 Conservation of Mechanical Energy",
                        "4.5 Power and Efficiency of Machines"
                    ]
                },
                {
                    "title": "Simple Machines",
                    "chapters": [
                        "5.1 Principles of Simple Machines",
                        "5.2 Levers, Pulleys, and Inclined Planes",
                        "5.3 Mechanical Advantage, Velocity Ratio, and Efficiency"
                    ]
                }
            ]
        },
        "english": {
            "name": "English",
            "units": [
                {
                    "title": "Living in a Community",
                    "chapters": [
                        "1.1 Listening and Speaking: Community Life",
                        "1.2 Reading Comprehension: Community Values",
                        "1.3 Vocabulary: Word Formation and Collocations",
                        "1.4 Grammar: Simple Present and Present Continuous",
                        "1.5 Writing: Paragraph Development"
                    ]
                },
                {
                    "title": "Water and Life",
                    "chapters": [
                        "2.1 Listening: Water Resources in Ethiopia",
                        "2.2 Reading: Conservation of Water",
                        "2.3 Vocabulary: Environmental Terminology",
                        "2.4 Grammar: Past Simple and Past Continuous",
                        "2.5 Writing: Narrative Paragraphs"
                    ]
                },
                {
                    "title": "Indigenous Heritage and Tourism",
                    "chapters": [
                        "3.1 Listening: Cultural Heritage Sites",
                        "3.2 Reading: Traditional Ethiopian Crafts and Architecture",
                        "3.3 Vocabulary: Descriptive Adjectives",
                        "3.4 Grammar: Present Perfect and Past Perfect",
                        "3.5 Writing: Descriptive Essays"
                    ]
                },
                {
                    "title": "Technology in Modern Society",
                    "chapters": [
                        "4.1 Listening: Digital Tools in Everyday Life",
                        "4.2 Reading: Innovations in Agriculture and Communication",
                        "4.3 Vocabulary: Technology and Innovation",
                        "4.4 Grammar: Modals of Ability, Obligation, and Permission",
                        "4.5 Writing: Expository Paragraphs"
                    ]
                }
            ]
        },
        "it": {
            "name": "Information Technology",
            "units": [
                {
                    "title": "Information Systems and Society",
                    "chapters": [
                        "1.1 Basics of Information Systems",
                        "1.2 Hardware and Software Components",
                        "1.3 Ethical and Social Issues in IT",
                        "1.4 Health and Environmental Impacts of Technology"
                    ]
                },
                {
                    "title": "Computer Networks and the Internet",
                    "chapters": [
                        "2.1 Network Fundamentals and Topologies",
                        "2.2 Transmission Media and Network Devices",
                        "2.3 The Internet, WWW, and Web Browsing",
                        "2.4 Network Security and Cyber Safety"
                    ]
                },
                {
                    "title": "Productivity Software and Applications",
                    "chapters": [
                        "3.1 Advanced Word Processing",
                        "3.2 Spreadsheet Modeling and Calculations",
                        "3.3 Presentation Design and Delivery"
                    ]
                },
                {
                    "title": "Introduction to Computer Programming",
                    "chapters": [
                        "4.1 Algorithms and Problem Solving (Flowcharts & Pseudocode)",
                        "4.2 Basic Programming Concepts (Variables, Data Types)",
                        "4.3 Control Structures (Conditionals and Loops)"
                    ]
                }
            ]
        }
    },
    10: {
        "biology": {
            "name": "Biology",
            "units": [
                {
                    "title": "Sub-fields of Biology",
                    "chapters": [
                        "1.1 Sub-disciplines and Specializations in Biology",
                        "1.2 Roles of Biologists in Agriculture, Medicine, and Industry",
                        "1.3 Ethical Considerations in Biological Research"
                    ]
                },
                {
                    "title": "Plants",
                    "chapters": [
                        "2.1 Characteristics and Diversity of Plants",
                        "2.2 Non-vascular vs. Vascular Plants",
                        "2.3 Structure of Flowering Plants (Roots, Stems, Leaves)",
                        "2.4 Photosynthesis and Respiration in Plants",
                        "2.5 Plant Transport (Xylem and Phloem)",
                        "2.6 Reproduction and Development in Angiosperms"
                    ]
                },
                {
                    "title": "Biochemical Molecules",
                    "chapters": [
                        "3.1 Carbohydrates: Structure, Types, and Functions",
                        "3.2 Lipids: Composition, Roles, and Energy Storage",
                        "3.3 Proteins: Amino Acids, Structure, and Biological Roles",
                        "3.4 Nucleic Acids: DNA and RNA Structures",
                        "3.5 Chemical Tests for Biological Molecules"
                    ]
                },
                {
                    "title": "Ecology and Conservation",
                    "chapters": [
                        "4.1 Ecosystem Components and Food Webs",
                        "4.2 Nutrient Cycling in Ethiopian Ecosystems",
                        "4.3 Human Impacts on Natural Habitats",
                        "4.4 Biodiversity Conservation in National Parks of Ethiopia"
                    ]
                }
            ]
        },
        "chemistry": {
            "name": "Chemistry",
            "units": [
                {
                    "title": "Chemical Reactions and Stoichiometry",
                    "chapters": [
                        "1.1 Types of Chemical Reactions",
                        "1.2 Balancing Chemical Equations",
                        "1.3 The Mole Concept and Molar Mass",
                        "1.4 Stoichiometric Calculations and Limiting Reactants",
                        "1.5 Percentage Yield and Theoretical Yield"
                    ]
                },
                {
                    "title": "Solutions",
                    "chapters": [
                        "2.1 Types of Solutions and Solubility",
                        "2.2 Factors Affecting Solubility",
                        "2.3 Solution Concentration (Molarity, Molality, Mass Percent)",
                        "2.4 Preparation and Dilution of Standard Solutions"
                    ]
                },
                {
                    "title": "Acids, Bases, and Salts",
                    "chapters": [
                        "3.1 Theories of Acids and Bases (Arrhenius, Brønsted-Lowry)",
                        "3.2 Properties of Acids and Bases",
                        "3.3 The pH Scale and Indicators",
                        "3.4 Neutralization Reactions and Acid-Base Titrations",
                        "3.5 Salts and Their Preparation"
                    ]
                },
                {
                    "title": "Energy Changes in Chemical Reactions",
                    "chapters": [
                        "4.1 Exothermic and Endothermic Reactions",
                        "4.2 Enthalpy and Enthalpy Changes",
                        "4.3 Hess's Law and Calorimetry",
                        "4.4 Bond Energies and Reaction Heats"
                    ]
                }
            ]
        },
        "mathematics": {
            "name": "Mathematics",
            "units": [
                {
                    "title": "Relations and Functions",
                    "chapters": [
                        "1.1 Relations and Ordered Pairs",
                        "1.2 Definition of Functions and Domain/Range",
                        "1.3 Types of Functions (Injective, Surjective, Bijective)",
                        "1.4 Graphs of Functions and Transformations"
                    ]
                },
                {
                    "title": "Polynomial Functions",
                    "chapters": [
                        "2.1 Definition and Operations on Polynomials",
                        "2.2 Division of Polynomials, Remainder and Factor Theorems",
                        "2.3 Zeros of Polynomial Functions",
                        "2.4 Graphs of Quadratic and Cubic Polynomials"
                    ]
                },
                {
                    "title": "Exponential and Logarithmic Functions",
                    "chapters": [
                        "3.1 Exponential Functions and Graphs",
                        "3.2 Logarithmic Functions and Properties of Logarithms",
                        "3.3 Solving Exponential and Logarithmic Equations",
                        "3.4 Applications in Growth and Decay Models"
                    ]
                },
                {
                    "title": "Coordinate Geometry",
                    "chapters": [
                        "4.1 Distance Between Two Points and Midpoint Formula",
                        "4.2 Equation of a Straight Line (Slope-Intercept, Point-Slope)",
                        "4.3 Parallel and Perpendicular Lines",
                        "4.4 Equations of Circles"
                    ]
                },
                {
                    "title": "Plane Geometry and Vectors",
                    "chapters": [
                        "5.1 Geometric Proofs and Triangles",
                        "5.2 Vectors in a Plane (Component Form & Magnitude)",
                        "5.3 Vector Addition, Subtraction, and Scalar Multiplication"
                    ]
                }
            ]
        },
        "physics": {
            "name": "Physics",
            "units": [
                {
                    "title": "Motion in Two Dimensions",
                    "chapters": [
                        "1.1 Vector Review and Resolution",
                        "1.2 Projectile Motion (Horizontal and Angled)",
                        "1.3 Uniform Circular Motion and Centripetal Force",
                        "1.4 Relative Motion in Two Dimensions"
                    ]
                },
                {
                    "title": "Rotational Motion and Equilibrium",
                    "chapters": [
                        "2.1 Angular Displacement, Velocity, and Acceleration",
                        "2.2 Torque and Moment of Inertia",
                        "2.3 Conditions for Equilibrium of Rigid Bodies",
                        "2.4 Center of Gravity and Stability"
                    ]
                },
                {
                    "title": "Heat and Thermodynamics",
                    "chapters": [
                        "3.1 Temperature Scales and Thermal Expansion",
                        "3.2 Heat Transfer: Conduction, Convection, Radiation",
                        "3.3 Specific Heat Capacity and Latent Heat",
                        "3.4 First Law of Thermodynamics and Heat Engines"
                    ]
                },
                {
                    "title": "Wave Motion and Sound",
                    "chapters": [
                        "4.1 Wave Characteristics (Wavelength, Frequency, Speed)",
                        "4.2 Transverse and Longitudinal Waves",
                        "4.3 Sound Waves, Pitch, Loudness, and Doppler Effect",
                        "4.4 Reflection, Refraction, and Interference of Waves"
                    ]
                },
                {
                    "title": "Electrostatics and Electric Currents",
                    "chapters": [
                        "5.1 Electric Charges and Coulomb's Law",
                        "5.2 Electric Fields and Potential Difference",
                        "5.3 Ohm's Law and Resistance",
                        "5.4 Series and Parallel Circuits and Electrical Power"
                    ]
                }
            ]
        },
        "english": {
            "name": "English",
            "units": [
                {
                    "title": "Cultural Diversity and Unity",
                    "chapters": [
                        "1.1 Listening and Speaking: Celebrating Diversity",
                        "1.2 Reading: Traditional Cultural Festivities in Ethiopia",
                        "1.3 Vocabulary: Idioms and Phrasal Verbs",
                        "1.4 Grammar: Complex Sentences and Relative Clauses",
                        "1.5 Writing: Expository and Comparative Essays"
                    ]
                },
                {
                    "title": "Health and Well-Being",
                    "chapters": [
                        "2.1 Listening: Mental and Physical Health Awareness",
                        "2.2 Reading: Nutrition and Active Lifestyles",
                        "2.3 Vocabulary: Medical and Wellness Terminology",
                        "2.4 Grammar: Passive Voice and Reported Speech",
                        "2.5 Writing: Persuasive Articles"
                    ]
                },
                {
                    "title": "Environmental Protection",
                    "chapters": [
                        "3.1 Listening: Reforestation and Sustainable Agriculture",
                        "3.2 Reading: Renewable Energy Initiatives in Africa",
                        "3.3 Vocabulary: Climate Terminology and Word Roots",
                        "3.4 Grammar: Conditionals (Types 1, 2, and 3)",
                        "3.5 Writing: Problem-Solution Paragraphs"
                    ]
                }
            ]
        },
        "it": {
            "name": "Information Technology",
            "units": [
                {
                    "title": "Information Systems Security",
                    "chapters": [
                        "1.1 Information Security Fundamentals and Threats",
                        "1.2 Malware, Viruses, and Phishing",
                        "1.3 Authentication, Encryption, and Access Controls",
                        "1.4 Cyber Law and Ethical Regulations"
                    ]
                },
                {
                    "title": "Database Management Systems",
                    "chapters": [
                        "2.1 Relational Database Concepts and Tables",
                        "2.2 Primary Keys, Foreign Keys, and Normalization",
                        "2.3 Basic SQL Queries (SELECT, INSERT, UPDATE, DELETE)",
                        "2.4 Database Forms and Reports"
                    ]
                },
                {
                    "title": "Web Authoring and Design",
                    "chapters": [
                        "3.1 HTML5 Structure, Elements, and Tags",
                        "3.2 CSS Styling and Responsive Design",
                        "3.3 Web Publishing and Hosting Essentials"
                    ]
                }
            ]
        }
    },
    11: {
        "biology": {
            "name": "Biology",
            "units": [
                {
                    "title": "Biology and Technology",
                    "chapters": [
                        "1.1 Relationship Between Biology and Technology",
                        "1.2 Biological Diagnostic and Imaging Tools (CT, MRI, Ultrasound)",
                        "1.3 Applications of Biotechnology in Agriculture and Medicine",
                        "1.4 Bioethics and Societal Impacts"
                    ]
                },
                {
                    "title": "Characteristics of Animals",
                    "chapters": [
                        "2.1 General Characteristics and Classification of Animals",
                        "2.2 Invertebrate Phyla: Sponges to Arthropods",
                        "2.3 Chordates and Vertebrates",
                        "2.4 Anatomical and Physiological Adaptations of Animals"
                    ]
                },
                {
                    "title": "Enzymes",
                    "chapters": [
                        "3.1 Nature, Structure, and Properties of Enzymes",
                        "3.2 Mechanism of Enzyme Action (Lock-and-Key vs Induced Fit)",
                        "3.3 Factors Affecting Enzyme Activity (Temperature, pH, Substrate)",
                        "3.4 Enzyme Inhibition and Industrial Applications"
                    ]
                },
                {
                    "title": "Genetics",
                    "chapters": [
                        "4.1 Mendelian Genetics and Inheritance Patterns",
                        "4.2 Chromosomes, DNA Replication, and Protein Synthesis",
                        "4.3 Gene Mutations and Genetic Disorders",
                        "4.4 Recombinant DNA Technology and GMOs"
                    ]
                },
                {
                    "title": "The Human Body Systems",
                    "chapters": [
                        "5.1 The Nervous System and Sensory Coordination",
                        "5.2 The Endocrine System and Hormonal Control",
                        "5.3 The Musculoskeletal System and Locomotion",
                        "5.4 Homeostasis and Osmoregulation"
                    ]
                },
                {
                    "title": "Population and Natural Resources",
                    "chapters": [
                        "6.1 Population Ecology and Growth Models",
                        "6.2 Human Population Trends and Resource Consumption",
                        "6.3 Natural Resource Degradation and Conservation",
                        "6.4 Biodiversity Hotspots in Ethiopia"
                    ]
                }
            ]
        },
        "chemistry": {
            "name": "Chemistry",
            "units": [
                {
                    "title": "Fundamental Concepts in Chemistry",
                    "chapters": [
                        "1.1 The Scope and Role of Modern Chemistry",
                        "1.2 Measurements and Precision in Experimental Chemistry",
                        "1.3 Stoichiometric Relationships in Chemical Reactions"
                    ]
                },
                {
                    "title": "Atomic Structure and Periodic Properties",
                    "chapters": [
                        "2.1 Quantum Mechanical Model of the Atom",
                        "2.2 Electronic Configurations and Quantum Numbers",
                        "2.3 Periodic Trends in Ionization Energy and Electronegativity"
                    ]
                },
                {
                    "title": "Chemical Bonding and Molecular Structure",
                    "chapters": [
                        "3.1 Ionic, Covalent, and Metallic Bonding",
                        "3.2 VSEPR Theory and Molecular Geometries",
                        "3.3 Hybridization of Atomic Orbitals",
                        "3.4 Intermolecular Forces (Dipole-Dipole, Hydrogen Bonding, London Forces)"
                    ]
                },
                {
                    "title": "States of Matter",
                    "chapters": [
                        "4.1 Kinetic Molecular Theory of Gases",
                        "4.2 Gas Laws (Boyle, Charles, Ideal Gas Equation)",
                        "4.3 Intermolecular Forces in Liquids and Solids",
                        "4.4 Phase Changes and Phase Diagrams"
                    ]
                },
                {
                    "title": "Chemical Kinetics",
                    "chapters": [
                        "5.1 Reaction Rates and Rate Laws",
                        "5.2 Collision Theory and Activation Energy",
                        "5.3 Factors Affecting Rates of Reactions",
                        "5.4 Catalysis and Reaction Mechanisms"
                    ]
                },
                {
                    "title": "Chemical Equilibrium",
                    "chapters": [
                        "6.1 Dynamic Equilibrium and Equilibrium Constants (Kc, Kp)",
                        "6.2 Le Chatelier's Principle and Equilibrium Shifts",
                        "6.3 Solubility Equilibria and Common Ion Effect"
                    ]
                }
            ]
        },
        "mathematics": {
            "name": "Mathematics",
            "units": [
                {
                    "title": "Relations and Functions",
                    "chapters": [
                        "1.1 Cartesian Products and Definition of Relations",
                        "1.2 Types of Functions (Injective, Surjective, Bijective)",
                        "1.3 Inverse Functions and Graphs",
                        "1.4 Composition and Algebra of Functions"
                    ]
                },
                {
                    "title": "Rational Expressions and Rational Functions",
                    "chapters": [
                        "2.1 Simplifying and Operating on Rational Expressions",
                        "2.2 Domain, Range, and Intercepts of Rational Functions",
                        "2.3 Vertical, Horizontal, and Slant Asymptotes",
                        "2.4 Graphing Rational Functions"
                    ]
                },
                {
                    "title": "Matrices",
                    "chapters": [
                        "3.1 Definition, Order, and Types of Matrices",
                        "3.2 Matrix Addition, Subtraction, and Scalar Multiplication",
                        "3.3 Matrix Multiplication and Properties",
                        "3.4 Transpose and Symmetric Matrices"
                    ]
                },
                {
                    "title": "Determinants and Their Properties",
                    "chapters": [
                        "4.1 Determinant of 2x2 and 3x3 Matrices",
                        "4.2 Properties of Determinants and Elementary Row Operations",
                        "4.3 Inverses of Square Matrices (Adjoint Method)",
                        "4.4 Solving Linear Systems Using Cramer's Rule"
                    ]
                },
                {
                    "title": "Vectors",
                    "chapters": [
                        "5.1 Vector Representation in Plane and Space",
                        "5.2 Vector Operations and Unit Vectors",
                        "5.3 Dot (Scalar) Product and Angles Between Vectors",
                        "5.4 Vector Projections and Applications"
                    ]
                },
                {
                    "title": "Transformation of the Plane",
                    "chapters": [
                        "6.1 Isometries and Coordinate Translations",
                        "6.2 Reflections Across Axes and Lines",
                        "6.3 Rotations About the Origin",
                        "6.4 Dilations and Matrix Representations of Transformations"
                    ]
                },
                {
                    "title": "Statistics",
                    "chapters": [
                        "7.1 Frequency Distributions of Grouped Data",
                        "7.2 Measures of Central Tendency (Mean, Median, Mode)",
                        "7.3 Measures of Position (Quartiles, Deciles, Percentiles)",
                        "7.4 Measures of Dispersion (Variance, Standard Deviation)"
                    ]
                },
                {
                    "title": "Probability",
                    "chapters": [
                        "8.1 Fundamental Counting Principles, Permutations, and Combinations",
                        "8.2 Probability Axioms and Sample Spaces",
                        "8.3 Addition and Multiplication Rules of Probability",
                        "8.4 Conditional Probability and Independent Events"
                    ]
                }
            ]
        },
        "physics": {
            "name": "Physics",
            "units": [
                {
                    "title": "Physics and Human Society",
                    "chapters": [
                        "1.1 Importance of Physics in Technological Progress",
                        "1.2 Scientific Method and Experimental Design",
                        "1.3 SI Units and Physical Dimensions"
                    ]
                },
                {
                    "title": "Vectors",
                    "chapters": [
                        "2.1 Coordinate Systems and Vector Components",
                        "2.2 Vector Addition and Subtraction (Analytical)",
                        "2.3 Dot Product and Cross Product of Vectors",
                        "2.4 Applications of Vectors in 2D and 3D Mechanics"
                    ]
                },
                {
                    "title": "Motion in One and Two Dimensions",
                    "chapters": [
                        "3.1 Kinematic Equations for Constant Acceleration",
                        "3.2 Graphical Differentiation and Integration of Motion",
                        "3.3 Projectile Motion at Arbitrary Angles",
                        "3.4 Relative Velocity and Uniform Circular Motion"
                    ]
                },
                {
                    "title": "Dynamics",
                    "chapters": [
                        "4.1 Newton's Laws and Applications with Friction",
                        "4.2 Momentum, Impulse, and 2D Collisions",
                        "4.3 Work-Energy Theorem and Conservative Forces",
                        "4.4 Rotational Dynamics, Torque, and Angular Momentum",
                        "4.5 Static Equilibrium of Rigid Bodies"
                    ]
                },
                {
                    "title": "Heat Conduction and Calorimetry",
                    "chapters": [
                        "5.1 Thermal Equilibrium and Temperature Scales",
                        "5.2 Specific Heat and Latent Heat Determinations",
                        "5.3 Conduction, Convection, and Blackbody Radiation",
                        "5.4 Thermodynamics Laws (Zeroth and First Laws)"
                    ]
                },
                {
                    "title": "Electrostatics and Electric Circuits",
                    "chapters": [
                        "6.1 Coulomb's Law and Electric Potential",
                        "6.2 Capacitors in Series and Parallel",
                        "6.3 Direct Current Circuits and Kirchhoff's Rules",
                        "6.4 Electric Power and Circuit Safety"
                    ]
                },
                {
                    "title": "Nuclear Physics",
                    "chapters": [
                        "7.1 Nuclear Structure, Mass Defect, and Binding Energy",
                        "7.2 Radioactive Decay Laws and Half-Life",
                        "7.3 Nuclear Fission, Fusion, and Energy Generation",
                        "7.4 Radiation Hazards and Applications in Medicine"
                    ]
                }
            ]
        },
        "english": {
            "name": "English",
            "units": [
                {
                    "title": "Traffic Safety and Urban Mobility",
                    "chapters": [
                        "1.1 Listening: Public Transport Challenges",
                        "1.2 Reading: Preventing Traffic Accidents",
                        "1.3 Vocabulary: Urban Planning and Road Safety",
                        "1.4 Grammar: Modals of Deduction and Speculation",
                        "1.5 Writing: Cause-and-Effect Essays"
                    ]
                },
                {
                    "title": "Youth and Entrepreneurship",
                    "chapters": [
                        "2.1 Listening: Young Business Innovators in Ethiopia",
                        "2.2 Reading: Small-Scale Enterprises and Financing",
                        "2.3 Vocabulary: Commercial and Business Terms",
                        "2.4 Grammar: Subjunctive Mood and Conditional Sentences",
                        "2.5 Writing: Business Letters and Proposals"
                    ]
                },
                {
                    "title": "Indigenous Knowledge and Science",
                    "chapters": [
                        "3.1 Listening: Traditional Medicine and Ecological Knowledge",
                        "3.2 Reading: Integrating Indigenous Wisdom with Science",
                        "3.3 Vocabulary: Academic and Research Registers",
                        "3.4 Grammar: Inversion and Emphatic Structures",
                        "3.5 Writing: Argumentative Essays"
                    ]
                }
            ]
        },
        "it": {
            "name": "Information Technology",
            "units": [
                {
                    "title": "Information Systems Architecture",
                    "chapters": [
                        "1.1 Enterprise Information Systems Architecture",
                        "1.2 Hardware Infrastructure and Server Virtualization",
                        "1.3 System Software and Operating Systems",
                        "1.4 IT Governance and Compliance"
                    ]
                },
                {
                    "title": "Networking and Communications",
                    "chapters": [
                        "2.1 OSI Reference Model and TCP/IP Protocol Suite",
                        "2.2 IPv4 and IPv6 Addressing and Subnetting",
                        "2.3 Routing and Switching Technologies",
                        "2.4 Wireless Networks and Mobile Protocols"
                    ]
                },
                {
                    "title": "Object-Oriented Programming",
                    "chapters": [
                        "3.1 Core OOP Principles (Encapsulation, Inheritance, Polymorphism)",
                        "3.2 Classes, Objects, and Constructors",
                        "3.3 Methods, Arrays, and Collections",
                        "3.4 Exception Handling and File I/O"
                    ]
                }
            ]
        }
    },
    12: {
        "biology": {
            "name": "Biology",
            "units": [
                {
                    "title": "Application of Biology",
                    "chapters": [
                        "1.1 Application in Conservation of Natural Resources",
                        "1.2 Food and Nutrition Security",
                        "1.3 Conscious Citizens and Sustainable Development",
                        "1.4 Applications in Biotechnology",
                        "1.5 Genetic Engineering and GMOs",
                        "1.6 Health, Pharmacology, and Well-being"
                    ]
                },
                {
                    "title": "Microorganisms",
                    "chapters": [
                        "2.1 Types and Diversity of Microorganisms",
                        "2.2 Characteristics and Structures of Bacteria and Viruses",
                        "2.3 Economic and Ecological Importance of Microorganisms",
                        "2.4 Pathogenic Microbes, Transmission, and Immunology"
                    ]
                },
                {
                    "title": "Energy Transformation",
                    "chapters": [
                        "3.1 Energy in Cells and Role of ATP",
                        "3.2 Photosynthesis (Light & Dark Reactions, C3, C4, CAM)",
                        "3.3 Continuity of Life and Atmospheric Carbon Balance",
                        "3.4 Cellular Respiration (Glycolysis, Krebs Cycle, Oxidative Phosphorylation)"
                    ]
                },
                {
                    "title": "Evolution",
                    "chapters": [
                        "4.1 Core Evolutionary Theories and Natural Selection",
                        "4.2 Evidence of Evolution (Fossil, Comparative Anatomy, Molecular)",
                        "4.3 Renowned Anthropologists in Ethiopia and Hominid Discoveries",
                        "4.4 Renowned Evolutionary Biologists in East Africa"
                    ]
                },
                {
                    "title": "Human Body System",
                    "chapters": [
                        "5.1 Central and Peripheral Nervous Systems",
                        "5.2 Structure and Function of Sense Organs (Eye and Ear)",
                        "5.3 Homeostatic Control Mechanisms (Thermoregulation & Osmoregulation)"
                    ]
                },
                {
                    "title": "Climate Change",
                    "chapters": [
                        "6.1 Causes of Climate Change and Greenhouse Gases",
                        "6.2 Ecological and Socioeconomic Effects of Global Warming",
                        "6.3 International Climate Treaties and Ethiopia's CRGE Strategy"
                    ]
                }
            ]
        },
        "chemistry": {
            "name": "Chemistry",
            "units": [
                {
                    "title": "Acid-Base Equilibria",
                    "chapters": [
                        "1.1 Arrhenius, Brønsted-Lowry, and Lewis Concepts",
                        "1.2 Autoionization of Water and pH/pOH Calculations",
                        "1.3 Acid and Base Dissociation Constants (Ka, Kb)",
                        "1.4 Hydrolysis of Salts and Acid-Base Titration Curves",
                        "1.5 Buffer Solutions and Henderson-Hasselbalch Equation"
                    ]
                },
                {
                    "title": "Electrochemistry",
                    "chapters": [
                        "2.1 Oxidation-Reduction Reactions and Balancing",
                        "2.2 Electrochemical Cells (Galvanic/Voltaic Cells)",
                        "2.3 Standard Electrode Potentials and Nernst Equation",
                        "2.4 Electrolysis, Faraday's Laws, and Industrial Applications",
                        "2.5 Batteries, Fuel Cells, and Corrosion Prevention"
                    ]
                },
                {
                    "title": "Industrial Chemistry",
                    "chapters": [
                        "3.1 Natural Resources and Chemical Manufacturing in Ethiopia",
                        "3.2 Manufacture of Ammonia, Nitric Acid, and Fertilizers",
                        "3.3 Manufacture of Sulfuric Acid (Contact Process)",
                        "3.4 Cement, Glass, Ceramics, and Sugar Industries"
                    ]
                },
                {
                    "title": "Polymers",
                    "chapters": [
                        "4.1 Introduction to Polymers and Monomers",
                        "4.2 Polymerization Reactions (Addition vs Condensation)",
                        "4.3 Synthetic Polymers (Plastics, Fibers, Elastomers)",
                        "4.4 Natural Polymers (Proteins, Nucleic Acids, Cellulose)",
                        "4.5 Environmental Impacts of Plastics and Recycling"
                    ]
                },
                {
                    "title": "Environmental Chemistry",
                    "chapters": [
                        "5.1 Components of the Environment and Biogeochemical Cycles",
                        "5.2 Air, Water, and Soil Pollution Chemistry",
                        "5.3 Greenhouse Gases, Global Warming, and Ozone Depletion",
                        "5.4 Principles of Green Chemistry and Sustainable Production"
                    ]
                }
            ]
        },
        "mathematics": {
            "name": "Mathematics",
            "units": [
                {
                    "title": "Sequence and Series",
                    "chapters": [
                        "1.1 Introduction to Sequences (Finite and Infinite)",
                        "1.2 Arithmetic Progressions and Arithmetic Series",
                        "1.3 Geometric Progressions and Infinite Geometric Series",
                        "1.4 Sigma Notation and Mathematical Induction",
                        "1.5 Applications of Sequences in Modeling"
                    ]
                },
                {
                    "title": "Introduction to Calculus",
                    "chapters": [
                        "2.1 Limits of Functions and Continuity",
                        "2.2 Derivatives: Definition, Tangent Lines, and Rates of Change",
                        "2.3 Rules of Differentiation (Power, Product, Quotient, Chain Rule)",
                        "2.4 Applications of Derivatives: Extrema, Concavity, and Curve Sketching",
                        "2.5 Indefinite Integrals and Fundamental Theorem of Calculus",
                        "2.6 Definite Integrals and Area Under Curves"
                    ]
                },
                {
                    "title": "Statistics",
                    "chapters": [
                        "3.1 Measures of Central Tendency for Grouped Data",
                        "3.2 Measures of Dispersion (Range, Variance, Standard Deviation)",
                        "3.3 Frequency Distributions, Histograms, and Ogives",
                        "3.4 Correlation and Bivariate Data Basics"
                    ]
                },
                {
                    "title": "Introduction to Linear Programming",
                    "chapters": [
                        "4.1 Systems of Linear Inequalities in Two Variables",
                        "4.2 Feasible Regions and Convex Polygons",
                        "4.3 Objective Functions and Corner-Point Optimization Method",
                        "4.4 Real-World Applications in Resource Allocation"
                    ]
                },
                {
                    "title": "Mathematical Applications in Business",
                    "chapters": [
                        "5.1 Ratios, Rates, Proportions, and Percentages",
                        "5.2 Markups, Markdowns, Discounts, and Profits",
                        "5.3 Simple Interest and Compound Interest Formulas",
                        "5.4 Annuities, Sinking Funds, and Depreciation Calculations"
                    ]
                }
            ]
        },
        "physics": {
            "name": "Physics",
            "units": [
                {
                    "title": "Application of Physics in Other Fields",
                    "chapters": [
                        "1.1 Physics in Engineering and Technology",
                        "1.2 Physics in Chemistry and Biological Systems (Biophysics)",
                        "1.3 Physics in Geosciences, Meteorology, and Astrophysics",
                        "1.4 Physics in Defense, Telecommunications, and Medical Imaging"
                    ]
                },
                {
                    "title": "Two-Dimensional Motion",
                    "chapters": [
                        "2.1 Vectors in Two Dimensions",
                        "2.2 Projectile Motion (Trajectory, Time of Flight, Range)",
                        "2.3 Uniform and Non-uniform Circular Motion",
                        "2.4 Relative Velocity in Two Dimensions"
                    ]
                },
                {
                    "title": "Fluid Mechanics",
                    "chapters": [
                        "3.1 Fluid Statics, Density, and Pressure in Liquids",
                        "3.2 Pascal's Principle and Hydraulic Machines",
                        "3.3 Archimedes' Principle and Buoyancy",
                        "3.4 Fluid Dynamics, Continuity Equation, and Bernoulli's Principle",
                        "3.5 Viscosity, Surface Tension, and Capillarity"
                    ]
                },
                {
                    "title": "Electromagnetism",
                    "chapters": [
                        "4.1 Magnetic Fields, Forces, and Motion of Charged Particles",
                        "4.2 Magnetic Force on Current-Carrying Conductors",
                        "4.3 Electromagnetic Induction (Faraday's and Lenz's Laws)",
                        "4.4 Inductance, AC Circuits, and Transformers",
                        "4.5 Maxwell's Equations and Electromagnetic Waves"
                    ]
                },
                {
                    "title": "Basics of Electronics",
                    "chapters": [
                        "5.1 Energy Bands in Solids (Conductors, Semiconductors, Insulators)",
                        "5.2 P-Type and N-Type Semiconductors",
                        "5.3 P-N Junction Diodes and Rectification Circuits",
                        "5.4 Transistors (Bipolar Junction Transistors - BJTs)",
                        "5.5 Digital Electronics, Boolean Logic, and Logic Gates"
                    ]
                }
            ]
        },
        "english": {
            "name": "English",
            "units": [
                {
                    "title": "Sustainable Development",
                    "chapters": [
                        "1.1 Listening: Goals for Global Sustainability",
                        "1.2 Reading: Renewable Resources in East Africa",
                        "1.3 Vocabulary: Development and Conservation Terminology",
                        "1.4 Grammar: Perfect Aspect and Participle Clauses",
                        "1.5 Writing: Synthesis and Research Summaries"
                    ]
                },
                {
                    "title": "Time Management and Study Skills",
                    "chapters": [
                        "2.1 Listening: High-Performance Study Techniques",
                        "2.2 Reading: Prioritization and Cognitive Focus",
                        "2.3 Vocabulary: Idiomatic Expressions of Time",
                        "2.4 Grammar: Cleft Sentences and Emphasis",
                        "2.5 Writing: Reflective Self-Evaluation"
                    ]
                },
                {
                    "title": "Evidence on Traffic Accident Prevention",
                    "chapters": [
                        "3.1 Listening: National Safety Statistics and Campaigns",
                        "3.2 Reading: Investigative Journalism on Road Safety",
                        "3.3 Vocabulary: Legal and Investigatory Registers",
                        "3.4 Grammar: Mixed Conditionals and Wish Clauses",
                        "3.5 Writing: Analytical Reports"
                    ]
                },
                {
                    "title": "Natural Resource Management",
                    "chapters": [
                        "4.1 Listening: Watershed and Soil Conservation",
                        "4.2 Reading: Ethiopia's Green Legacy Initiative",
                        "4.3 Vocabulary: Ecological and Agricultural Roots",
                        "4.4 Grammar: Subordinate Clauses and Cohesive Markers",
                        "4.5 Writing: Policy Briefs and Recommendations"
                    ]
                },
                {
                    "title": "Mechanized Agriculture and Green Economies",
                    "chapters": [
                        "5.1 Listening: Modern Irrigation and Crop Technologies",
                        "5.2 Reading: Sustainable Industrial Farming",
                        "5.3 Vocabulary: Agronomy and Economic Terminology",
                        "5.4 Grammar: Advanced Passive Constructions",
                        "5.5 Writing: Critical Evaluative Essays"
                    ]
                }
            ]
        },
        "it": {
            "name": "Information Technology",
            "units": [
                {
                    "title": "Ethical and Social Issues in IT",
                    "chapters": [
                        "1.1 Ethical, Legal, Social, and Environmental Issues in IT",
                        "1.2 Intellectual Property Rights and Software Licensing",
                        "1.3 Digital Identity and Privacy Management",
                        "1.4 Digital Collaboration Tools and Civic Engagement"
                    ]
                },
                {
                    "title": "Emerging Technologies",
                    "chapters": [
                        "2.1 Big Data Characteristics, Benefits, and Challenges",
                        "2.2 Cloud Computing (IaaS, PaaS, SaaS, Deployment Models)",
                        "2.3 Fog Computing and Edge Computing Architectures",
                        "2.4 Internet of Things (IoT) Frameworks and Applications",
                        "2.5 Artificial Intelligence and Machine Learning Fundamentals"
                    ]
                },
                {
                    "title": "Database Design and Advanced SQL",
                    "chapters": [
                        "3.1 Advanced Entity-Relationship (ER) Modeling",
                        "3.2 Advanced SQL (JOINs, Subqueries, Aggregations)",
                        "3.3 Database Integrity, Transactions, and ACID Properties",
                        "3.4 Web Database Integration Concepts"
                    ]
                }
            ]
        }
    }
}

for grade_num in [9, 10, 11, 12]:
    grade_obj = {
        "grade": grade_num,
        "subjects": []
    }
    subj_order = 1
    for s_key, s_data in GRADE_DATA[grade_num].items():
        subject_id = f"g{grade_num:02d}-{s_key}"
        subject_obj = {
            "id": subject_id,
            "name": s_data["name"],
            "order": subj_order,
            "review_status": "verified",
            "units": []
        }
        subj_order += 1
        
        for u_idx, u_info in enumerate(s_data["units"], 1):
            unit_id = f"g{grade_num:02d}-{s_key[:3]}-u{u_idx:02d}"
            unit_obj = {
                "id": unit_id,
                "number": str(u_idx),
                "title": f"Unit {u_idx} - {u_info['title']}",
                "order": u_idx,
                "review_status": "verified",
                "estimatedHours": 8,
                "chapters": []
            }
            
            for c_idx, chap_title in enumerate(u_info["chapters"], 1):
                chap_id = f"{unit_id}-c{c_idx:02d}"
                # If chap_title starts with a number like "1.1", extract chapter number
                parts = chap_title.split(" ", 1)
                chap_num = parts[0] if "." in parts[0] else f"{u_idx}.{c_idx}"
                clean_title = chap_title
                
                chap_obj = {
                    "id": chap_id,
                    "number": chap_num,
                    "title": clean_title,
                    "order": c_idx,
                    "review_status": "verified",
                    "subtopics": []
                }
                unit_obj["chapters"].append(chap_obj)
                
            subject_obj["units"].append(unit_obj)
        grade_obj["subjects"].append(subject_obj)
    curriculum_data["curriculum"]["grades"].append(grade_obj)

# Write to master file
os.makedirs("curriculum", exist_ok=True)
master_path = "curriculum/ethiopian_curriculum_master.json"
with open(master_path, "w", encoding="utf-8") as f:
    json.dump(curriculum_data, f, indent=2)

# Also write to web public folder
os.makedirs("apps/web/public/data", exist_ok=True)
web_path = "apps/web/public/data/curriculum.json"
with open(web_path, "w", encoding="utf-8") as f:
    json.dump(curriculum_data, f, indent=2)

total_units = sum(len(s["units"]) for g in curriculum_data["curriculum"]["grades"] for s in g["subjects"])
total_chaps = sum(len(u["chapters"]) for g in curriculum_data["curriculum"]["grades"] for s in g["subjects"] for u in s["units"])
print(f"Generated comprehensive curriculum: {len(curriculum_data['curriculum']['grades'])} grades, {total_units} units, {total_chaps} chapters/subtopics.")
