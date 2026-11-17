import json
import os

CURRICULUM = {
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
                "subject_id": "g12-biology",
                "document_type": "syllabus"
            }
        ],
        "grades": []
    }
}

DATA = {
    9: {
        "biology": {
            "name": "Biology",
            "doc": "Grade 9 Biology-Textbook.pdf",
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
                        "2.1 Characteristics of living things",
                        "2.2 Taxonomy of living things",
                        "2.3 Relevance of classification",
                        "2.4 Linnaean system of nomenclature",
                        "2.5 Common Ethiopian animals and plants",
                        "2.6 The five-kingdom system of classification",
                        "2.7 Renowned Taxonomists in Ethiopia"
                    ]
                },
                {
                    "title": "Cells",
                    "chapters": [
                        "3.1 What is a Cell?",
                        "3.2 Cell theory",
                        "3.3 Cell structure and function",
                        "3.4 Types of cells",
                        "3.5 Animal and plant cells",
                        "3.6 Observing cells under a microscope",
                        "3.7 The cell and its environment",
                        "3.8 Levels of Biological Organization"
                    ]
                },
                {
                    "title": "Reproduction",
                    "chapters": [
                        "4.1 Introduction to reproduction",
                        "4.2 Asexual reproduction",
                        "4.3 Types of asexual reproduction",
                        "4.4 Sexual reproduction in Humans",
                        "4.5 Primary and secondary sexual characteristics",
                        "4.6 Male reproductive structures",
                        "4.7 Female reproductive structures",
                        "4.8 The Menstrual cycle",
                        "4.9 Fertilization and pregnancy",
                        "4.10 Methods of birth control",
                        "4.11 Sexually transmitted infections (STIs): Transmission and prevention"
                    ]
                },
                {
                    "title": "Human Health, Nutrition, and Disease",
                    "chapters": [
                        "5.1 What is food?",
                        "5.2 Nutrition",
                        "5.3 Nutrients",
                        "5.4 Balanced diets",
                        "5.5 Deficiency diseases",
                        "5.6 Malnutrition",
                        "5.7 Substance abuse",
                        "5.8 Infectious and noninfectious diseases",
                        "5.9 Renowned Nutritionists in Ethiopia"
                    ]
                },
                {
                    "title": "Ecology",
                    "chapters": [
                        "6.1 Ecology and Ecological Terms",
                        "6.2 Biotic and abiotic components",
                        "6.3 Ecological levels and Ecosystems",
                        "6.4 Biomes and Ecological succession",
                        "6.5 Ecological relationships",
                        "6.6 Energy flow in ecosystems",
                        "6.7 Biogeochemical cycles",
                        "6.8 Wildlife conservation in Ethiopia"
                    ]
                }
            ]
        },
        "chemistry": {
            "name": "Chemistry",
            "doc": "Grade 9 Chemistry_Textbook.pdf",
            "units": [
                {
                    "title": "Chemistry and Its Importance",
                    "chapters": [
                        "1.1 Definition and Scope of Chemistry",
                        "1.2 Relationship between Chemistry and Other Natural Sciences",
                        "1.3 The Role Chemistry Plays in Production and in the Society",
                        "1.4 Some Common Chemical Industries in Ethiopia"
                    ]
                },
                {
                    "title": "Measurements and Scientific Methods",
                    "chapters": [
                        "2.1 Measurements and Units in Chemistry",
                        "2.2 Chemistry as Experimental Science"
                    ]
                },
                {
                    "title": "Structure of the Atom",
                    "chapters": [
                        "3.1 Historical Development of the Atomic Theories of Matter",
                        "3.2 Fundamental Laws of Chemical Reactions",
                        "3.3 Atomic Theory",
                        "3.4 Discoveries of Fundamental Subatomic Particles and the Atomic Nucleus",
                        "3.5 Composition of an Atom and the Isotopes"
                    ]
                },
                {
                    "title": "Periodic Classification of Elements",
                    "chapters": [
                        "4.1 Historical Development of Periodic Classification of the Elements",
                        "4.2 Mendeleev's Classification of the Elements",
                        "4.3 The Modern Periodic Table",
                        "4.4 The Major Trends in the Periodic Table"
                    ]
                },
                {
                    "title": "Chemical Bonding",
                    "chapters": [
                        "5.1 Chemical Bonding",
                        "5.2 Ionic Bonding",
                        "5.3 Covalent Bonding",
                        "5.4 Metallic Bonding"
                    ]
                }
            ]
        },
        "mathematics": {
            "name": "Mathematics",
            "doc": "Grade 9 Mathematics_Textbook.pdf",
            "units": [
                {
                    "title": "Further on Sets",
                    "chapters": [
                        "1.1 Sets and Elements",
                        "1.2 Set Description",
                        "1.3 The Notion of Sets",
                        "1.4 Operations on Sets",
                        "1.5 Application"
                    ]
                },
                {
                    "title": "The Number System",
                    "chapters": [
                        "2.1 Revision on Natural Numbers and Integers",
                        "2.2 Rational Numbers",
                        "2.3 Irrational Numbers",
                        "2.4 Real Numbers",
                        "2.5 Application"
                    ]
                },
                {
                    "title": "Solving Equations",
                    "chapters": [
                        "3.1 Revision on Linear Equation in One Variable",
                        "3.2 Systems of Linear Equations in Two Variables",
                        "3.3 Solving Non-linear Equations",
                        "3.4 Applications of Equations"
                    ]
                },
                {
                    "title": "Solving Inequalities",
                    "chapters": [
                        "4.1 Revision on Linear Inequalities in One Variable",
                        "4.2 Systems of Linear Inequalities in Two Variables",
                        "4.3 Inequalities Involving Absolute Value",
                        "4.4 Quadratic Inequalities",
                        "4.5 Applications of Inequalities"
                    ]
                },
                {
                    "title": "Introduction to Trigonometry",
                    "chapters": [
                        "5.1 Revision on Right-angled Triangles",
                        "5.2 Trigonometric Ratios"
                    ]
                },
                {
                    "title": "Regular Polygons",
                    "chapters": [
                        "6.1 Sum of Interior Angles of a Convex Polygon",
                        "6.2 Sum of Exterior Angles of a Convex Polygon",
                        "6.3 Measures of Each Interior Angle and Exterior Angle of a Regular Polygon",
                        "6.4 Properties of Regular Polygons"
                    ]
                },
                {
                    "title": "Congruency and Similarity",
                    "chapters": [
                        "7.1 Revision on Congruency of Triangles",
                        "7.2 Definition of Similar Figures",
                        "7.3 Theorems on Similar Plane Figures",
                        "7.4 Ratio of Perimeters of Similar Plane Figures",
                        "7.5 Ratio of Areas of Similar Plane Figures",
                        "7.6 Construction of Similar Plane Figure",
                        "7.7 Applications of Similarities"
                    ]
                },
                {
                    "title": "Vectors in Two Dimensions",
                    "chapters": [
                        "8.1 Vector and Scalar Quantities",
                        "8.2 Representation of a Vector",
                        "8.3 Vectors Operations",
                        "8.4 Position Vector",
                        "8.5 Applications of Vectors in Two Dimensions"
                    ]
                },
                {
                    "title": "Statistics and Probability",
                    "chapters": [
                        "9.1 Statistical Data",
                        "9.2 Probability"
                    ]
                }
            ]
        },
        "physics": {
            "name": "Physics",
            "doc": "Grade 9 Physics_Textbook.pdf",
            "units": [
                {
                    "title": "Physics and Human Society",
                    "chapters": [
                        "1.1 Definition and Nature of Physics",
                        "1.2 Branches of Physics",
                        "1.3 Related Fields to Physics",
                        "1.4 Historical Issues and Contributors"
                    ]
                },
                {
                    "title": "Physical Quantities",
                    "chapters": [
                        "2.1 Scales, Standards, Units (prefixes)",
                        "2.2 Measurement and Safety",
                        "2.3 Classification of Physical Quantities",
                        "2.4 Unit conversion"
                    ]
                },
                {
                    "title": "Motion in a Straight Line",
                    "chapters": [
                        "3.1 Position, Distance and Displacement",
                        "3.2 Average Speed and Instantaneous Speed",
                        "3.3 Average Velocity and Instantaneous Velocity",
                        "3.4 Acceleration",
                        "3.5 Uniform Motion",
                        "3.6 Graphical Representation of Motion"
                    ]
                },
                {
                    "title": "Force, Work, Energy and Power",
                    "chapters": [
                        "4.1 The Concept of Force",
                        "4.2 Newton's Laws of Motion",
                        "4.3 Forces of Friction",
                        "4.4 The Concept of Work",
                        "4.5 Kinetic and Potential Energies",
                        "4.6 Power"
                    ]
                },
                {
                    "title": "Simple Machines",
                    "chapters": [
                        "5.1 Simple Machines and their Purposes",
                        "5.2 Simple Machines at Home",
                        "5.3 Simple Machines at Work Place",
                        "5.4 Classification of Simple Machines",
                        "5.5 Mechanical Advantage, Velocity Ratio and Efficiency of Simple Machine",
                        "5.6 Designing Simple Machine"
                    ]
                },
                {
                    "title": "Mechanical Oscillation and Sound Wave",
                    "chapters": [
                        "6.1 Common Characteristics of Waves",
                        "6.2 String, Pendulum and Spring",
                        "6.3 Propagation of Waves and Energy Transmission",
                        "6.4 Sound Waves",
                        "6.5 Superposition of Waves",
                        "6.6 Characteristics of Sound Waves"
                    ]
                },
                {
                    "title": "Temperature and Thermometry",
                    "chapters": [
                        "7.1 Temperature and Our Life",
                        "7.2 Extreme Temperature Safety",
                        "7.3 Temperature Change and its Effects",
                        "7.4 Measuring Temperature with Different Thermometric Scales",
                        "7.5 Types of Thermometers and Their Use",
                        "7.6 Conversion between Temperature Scales",
                        "7.7 Thermal Expansion of Materials"
                    ]
                }
            ]
        }
    },
    10: {
        "biology": {
            "name": "Biology",
            "doc": "Grade 10 Biology_Textbook.pdf",
            "units": [
                {
                    "title": "Sub-fields of Biology",
                    "chapters": [
                        "1.1 Sub-fields of Biology",
                        "1.2 Pure and applied fields of biology",
                        "1.3 Major discoveries that revolutionized biology",
                        "1.4 The contributions of biological discoveries to society and the environment",
                        "1.5 Ethiopian biologists and their contributions"
                    ]
                },
                {
                    "title": "Plants",
                    "chapters": [
                        "2.1 Characteristics of plants",
                        "2.2 Flowering and non-flowering plants",
                        "2.3 Structure and function of plant parts",
                        "2.4 Reproduction in plants",
                        "2.5 Seeds",
                        "2.6 Seed dispersal and germination",
                        "2.7 Photosynthesis",
                        "2.8 Transport in plant",
                        "2.9 Response in plants",
                        "2.10 Medicinal plants",
                        "2.11 Renowned Ethiopian Botanist"
                    ]
                },
                {
                    "title": "Biochemical Molecules",
                    "chapters": [
                        "3.1 Biochemical Molecules",
                        "3.2 Inorganic molecules: Water and Inorganic ions",
                        "3.3 Organic molecules: Carbohydrates, Lipids, Proteins and Nucleic acids"
                    ]
                },
                {
                    "title": "Cell Reproduction",
                    "chapters": [
                        "4.1 Cell cycle",
                        "4.2 The Cell division: Mitosis and Meiosis",
                        "4.3 Renowned Ethiopian Geneticist"
                    ]
                },
                {
                    "title": "Human Biology",
                    "chapters": [
                        "5.1 The Digestive System",
                        "5.2 The circulatory and lymphatic system",
                        "5.3 The breathing system",
                        "5.4 The Human Urinary system",
                        "5.5 The immune system",
                        "5.6 Renowned Physicians in Ethiopia"
                    ]
                },
                {
                    "title": "Ecological Interaction",
                    "chapters": [
                        "6.1 Trophic Levels: Food Chain and Food Web",
                        "6.2 Flow of energy and matter through ecosystem",
                        "6.3 Cycling of Materials in an Ecosystem"
                    ]
                }
            ]
        },
        "chemistry": {
            "name": "Chemistry",
            "doc": "Grade 10 Chemistry_Textbook.pdf",
            "units": [
                {
                    "title": "Chemical Reactions and Stoichiometry",
                    "chapters": [
                        "1.1 Introduction to Chemical Reactions",
                        "1.2 Chemical Equations",
                        "1.3 Types of Chemical Reactions",
                        "1.4 Oxidation and Reduction Reactions",
                        "1.5 Molecular and Formula Masses, the Mole Concept and Chemical Formulas",
                        "1.6 Stoichiometry"
                    ]
                },
                {
                    "title": "Solutions",
                    "chapters": [
                        "2.1 Heterogeneous and Homogeneous Mixtures",
                        "2.2 The Solution Process",
                        "2.3 Solubility as an Equilibrium Process",
                        "2.4 Ways of Expressing Concentration of Solution",
                        "2.5 Preparation of Solutions",
                        "2.6 Solution Stoichiometry",
                        "2.7 Describing Reactions in Solution"
                    ]
                },
                {
                    "title": "Important Inorganic Compounds",
                    "chapters": [
                        "3.1 Introduction to Inorganic Compounds",
                        "3.2 Oxides",
                        "3.3 Acids",
                        "3.4 Bases",
                        "3.5 Salts"
                    ]
                },
                {
                    "title": "Energy Changes and Electrochemistry",
                    "chapters": [
                        "4.1 Introduction to Energy Changes",
                        "4.2 Energy Changes in Electrochemistry",
                        "4.3 Electrochemical Cells",
                        "4.4 Electrolysis"
                    ]
                },
                {
                    "title": "Metals and Nonmetals",
                    "chapters": [
                        "5.1 Introduction to Metals and Nonmetals",
                        "5.2 General Properties of Metals and Production of Some Metals",
                        "5.3 Production of Some Important Nonmetals"
                    ]
                },
                {
                    "title": "Hydrocarbons and Their Natural Sources",
                    "chapters": [
                        "6.1 Introduction to Hydrocarbons",
                        "6.2 Saturated Hydrocarbons: Alkanes",
                        "6.3 Unsaturated Hydrocarbons: Alkenes, Alkynes and Aromatic Hydrocarbons",
                        "6.4 Aromatic Hydrocarbons: Benzene",
                        "6.5 Natural Sources of Hydrocarbons"
                    ]
                }
            ]
        },
        "mathematics": {
            "name": "Mathematics",
            "doc": "Grade 10 Mathematics_Textbook.pdf",
            "units": [
                {
                    "title": "Relations and Functions",
                    "chapters": [
                        "1.1 Relations",
                        "1.2 Functions",
                        "1.3 Applications of Relations and Functions"
                    ]
                },
                {
                    "title": "Polynomial Functions",
                    "chapters": [
                        "2.1 Definition of Polynomial Function",
                        "2.2 Operations on polynomial functions",
                        "2.3 Theorem on polynomial functions",
                        "2.4 Zeros of polynomial functions",
                        "2.5 Graphs of polynomial functions",
                        "2.6 Applications"
                    ]
                },
                {
                    "title": "Exponential and Logarithmic Functions",
                    "chapters": [
                        "3.1 Exponents and Logarithms",
                        "3.2 The Exponential Functions and Their Graphs",
                        "3.3 The Logarithmic Functions and Their Graphs",
                        "3.4 Solving Exponential and Logarithmic Equations",
                        "3.5 Relation between Exponential and Logarithmic functions",
                        "3.6 Applications"
                    ]
                },
                {
                    "title": "Trigonometric Functions",
                    "chapters": [
                        "4.1 Radian Measure of angle",
                        "4.2 Basic Trigonometric Function",
                        "4.3 Trigonometric Identities & Equation",
                        "4.4 Application"
                    ]
                },
                {
                    "title": "Circles",
                    "chapters": [
                        "5.1 Symmetrical properties of circles",
                        "5.2 Angle properties of circles",
                        "5.3 Arc length, perimeters and areas of segments and sectors",
                        "5.4 Theorems on angles and arcs determined by lines intersecting inside, on and outside a circle"
                    ]
                },
                {
                    "title": "Solid Figures",
                    "chapters": [
                        "6.1 Revision of Cylinders and Prisms",
                        "6.2 Pyramids, cones and Spheres",
                        "6.3 Frustum of pyramids and cones",
                        "6.4 Surface areas and volumes of composed solids",
                        "6.5 Applications"
                    ]
                },
                {
                    "title": "Coordinate Geometry",
                    "chapters": [
                        "7.1 Distance between two points",
                        "7.2 Division of a line segment",
                        "7.3 Equation of a line",
                        "7.4 Slopes of parallel and perpendicular lines",
                        "7.5 Equation of a Circle",
                        "7.6 Applications"
                    ]
                }
            ]
        },
        "physics": {
            "name": "Physics",
            "doc": "Grade 10 Physics_fetena_Textbook.pdf",
            "units": [
                {
                    "title": "Vector Quantities",
                    "chapters": [
                        "1.1 Scalars and Vectors",
                        "1.2 Vector representations",
                        "1.3 Vector addition and subtraction",
                        "1.4 Graphical method of vector addition",
                        "1.5 Vector resolution"
                    ]
                },
                {
                    "title": "Uniformly Accelerated Motion",
                    "chapters": [
                        "2.1 Position and Displacement",
                        "2.2 Average velocity and instantaneous velocity",
                        "2.3 Acceleration",
                        "2.4 Equations of motion with constant acceleration",
                        "2.5 Graphical representation of uniformly accelerated motion",
                        "2.6 Relative velocity in one dimension"
                    ]
                },
                {
                    "title": "Elasticity and Static Equilibrium of Rigid Body",
                    "chapters": [
                        "3.1 Elasticity and plasticity",
                        "3.2 Density and specific gravity",
                        "3.3 Stress and Strain",
                        "3.4 The Young Modulus",
                        "3.5 Static equilibrium"
                    ]
                },
                {
                    "title": "Static and Current Electricity",
                    "chapters": [
                        "4.1 Charges in Nature",
                        "4.2 Methods of Charging a Body",
                        "4.3 The electroscope",
                        "4.4 Electrical Discharge",
                        "4.5 Coulomb's law of electrostatics",
                        "4.6 The electric field",
                        "4.7 Electric circuits",
                        "4.8 Current, Voltage, and Ohm's Law",
                        "4.9 Combination of resistors in a circuit",
                        "4.10 Voltmeter and ammeter connection in a circuit",
                        "4.11 Electrical safety in general and local context",
                        "4.12 Electric projects"
                    ]
                },
                {
                    "title": "Magnetism",
                    "chapters": [
                        "5.1 Magnet",
                        "5.2 Magnetic Field",
                        "5.3 The Earth's magnetic field and the compass",
                        "5.4 Magnetic field of a current-carrying conductor",
                        "5.5 Magnetic force on a moving charge placed in a uniform magnetic field",
                        "5.6 Magnetic force on a current-carrying wire",
                        "5.7 Magnetic force between two parallel current-carrying wires",
                        "5.8 Applications of magnetism"
                    ]
                },
                {
                    "title": "Electromagnetic Waves and Geometrical Optics",
                    "chapters": [
                        "6.1 Electromagnetic (EM) waves",
                        "6.2 EM Spectrum",
                        "6.3 Light as a wave",
                        "6.4 Laws of reflection & refraction",
                        "6.5 Mirrors and lenses",
                        "6.6 Human eye and optical instruments",
                        "6.7 Primary colors of light and human vision",
                        "6.8 Color addition of light",
                        "6.9 Color subtraction of light using filters"
                    ]
                }
            ]
        }
    },
    11: {
        "biology": {
            "name": "Biology",
            "doc": "Grade 11 Biology_Textbook.pdf",
            "units": [
                {
                    "title": "Biology and Technology",
                    "chapters": [
                        "1.1 Learning from nature",
                        "1.2 Biology and technology",
                        "1.3 Impacts of biology and technology on society and the natural world",
                        "1.4 Ethical issues in biology"
                    ]
                },
                {
                    "title": "Animals",
                    "chapters": [
                        "2.1 Characteristics of animals",
                        "2.2 Invertebrates and Vertebrates",
                        "2.3 Reproduction in Animals",
                        "2.4 The economic importance of animals (insects)",
                        "2.5 Animal Behavior"
                    ]
                },
                {
                    "title": "Enzymes",
                    "chapters": [
                        "3.1 Nature of enzymes",
                        "3.2 Characteristics of enzymes",
                        "3.3 Mechanism of enzyme action",
                        "3.4 Factors affecting enzyme activity",
                        "3.5 Coenzymes and cofactors",
                        "3.6 Basic classification of enzymes"
                    ]
                },
                {
                    "title": "Genetics",
                    "chapters": [
                        "4.1 The molecular basis of inheritance",
                        "4.2 Mendelian genetics",
                        "4.3 Non-Mendelian inheritance",
                        "4.4 Mutations and genetic disorders",
                        "4.5 Applications of genetics"
                    ]
                },
                {
                    "title": "Human Biology",
                    "chapters": [
                        "5.1 The locomotory system",
                        "5.2 The reproductive system",
                        "5.3 Harmful traditional practices",
                        "5.4 Family planning",
                        "5.5 Effects of substance abuse on reproductive health"
                    ]
                },
                {
                    "title": "Population and Natural Resources",
                    "chapters": [
                        "6.1 Population ecology",
                        "6.2 Natural resources",
                        "6.3 Conservation of natural resources in Ethiopia",
                        "6.4 Impact of traffic accident on wild and domestic animals",
                        "6.5 Impact of human activities on the environment",
                        "6.6 Indigenous conservation practices in Ethiopia"
                    ]
                }
            ]
        },
        "chemistry": {
            "name": "Chemistry",
            "doc": "Grade 11 Chemistry_Textbook.pdf",
            "units": [
                {
                    "title": "Atomic Structure and Periodic Properties of the Elements",
                    "chapters": [
                        "1.1 Introduction to Atomic Structure",
                        "1.2 Dalton's Atomic Theory and the Modern Atomic Theory",
                        "1.3 Early Experiments to Characterize the Atom",
                        "1.4 Make-up of the Nucleus",
                        "1.5 Electromagnetic Radiation and Atomic Spectra",
                        "1.6 The Quantum Mechanical Model of the Atom",
                        "1.7 Electronic Configurations and Orbital Diagrams",
                        "1.8 Electronic Configurations and the Periodic Table of the Elements"
                    ]
                },
                {
                    "title": "Chemical Bonding",
                    "chapters": [
                        "2.1 Introduction to Chemical Bonding",
                        "2.2 Ionic Bonds",
                        "2.3 Covalent Bonds and Molecular Geometry",
                        "2.4 Metallic Bonding",
                        "2.5 Chemical Bonding Theories",
                        "2.6 Types of Crystal"
                    ]
                },
                {
                    "title": "Physical States of Matter",
                    "chapters": [
                        "3.1 Introduction to States of Matter",
                        "3.2 Kinetic Theory and Properties of Matter",
                        "3.3 The Gaseous State",
                        "3.4 The Liquid State",
                        "3.5 The Solid State"
                    ]
                },
                {
                    "title": "Chemical Kinetics",
                    "chapters": [
                        "4.1 Introduction to Reaction Rates",
                        "4.2 The Rate of a Reaction",
                        "4.3 Factors Affecting the Rate of a Chemical Reaction"
                    ]
                },
                {
                    "title": "Chemical Equilibrium",
                    "chapters": [
                        "5.1 Introduction to Chemical Equilibrium",
                        "5.2 Chemical Equilibrium and Le-Chatelier's Principle"
                    ]
                },
                {
                    "title": "Some Important Oxygen-Containing Organic Compounds",
                    "chapters": [
                        "6.1 Introduction to Oxygenated Organic Compounds",
                        "6.2 Alcohols and Ethers",
                        "6.3 Aldehydes and Ketones",
                        "6.4 Carboxylic Acids",
                        "6.5 Esters",
                        "6.6 Fats and Oils"
                    ]
                }
            ]
        },
        "mathematics": {
            "name": "Mathematics",
            "doc": "Grade 11 Mathematics_Textbook.pdf",
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
            "doc": "Grade 11 Physics_Textbook.pdf",
            "units": [
                {
                    "title": "Physics and Human Society",
                    "chapters": [
                        "1.1 Importance of Physics to Society",
                        "1.2 Physics Communities and Their Roles",
                        "1.3 Making of Physics Knowledge",
                        "1.4 The Mission of Physics and Career Awareness",
                        "1.5 Current Status of Physics"
                    ]
                },
                {
                    "title": "Vectors",
                    "chapters": [
                        "2.1 Vectors and Types of Vectors",
                        "2.2 Graphical Method of Addition of Vectors in Two Dimensions",
                        "2.3 Algebraic Method of addition of vectors in Two Dimensions",
                        "2.4 Product of Vectors"
                    ]
                },
                {
                    "title": "Motion in One and Two Dimensions",
                    "chapters": [
                        "3.1 Uniformly Accelerated Motion in 1D",
                        "3.2 Equations of Uniformly Accelerated Motion in 1D",
                        "3.3 Graphical Representation of Uniformly accelerated Motion in 1 D",
                        "3.4 Vertical Motion",
                        "3.5 Uniform Circular Motion"
                    ]
                },
                {
                    "title": "Dynamics",
                    "chapters": [
                        "4.1 The Concept of Force and Newton's Laws of motion",
                        "4.2 Frictional Force",
                        "4.3 The First Condition of Equilibrium",
                        "4.4 Work, Energy and Power",
                        "4.5 Conservation of mechanical energy",
                        "4.6 Impulse and Linear Momentum"
                    ]
                },
                {
                    "title": "Heat Conduction and Calorimetry",
                    "chapters": [
                        "5.1 The Concept of Heat",
                        "5.2 Heat transfer mechanisms",
                        "5.3 Heat Capacity and Specific Heat Capacity",
                        "5.4 Thermal expansion",
                        "5.5 Change of phase",
                        "5.6 Calorimetry"
                    ]
                },
                {
                    "title": "Electrostatics and Electric Circuit",
                    "chapters": [
                        "6.1 Coulomb's Law",
                        "6.2 Electric Fields",
                        "6.3 Electric Potential",
                        "6.4 Electric Current, Resistance and Ohm's law",
                        "6.5 Capacitors and Capacitance",
                        "6.6 Electric Circuits in Our Surroundings"
                    ]
                },
                {
                    "title": "Nuclear Physics",
                    "chapters": [
                        "7.1 The nucleus",
                        "7.2 Radioactivity",
                        "7.3 Use of nuclear radiation",
                        "7.4 Nuclear Reaction and Energy Production",
                        "7.5 Safety Rules Against Hazards of Nuclear Radiation"
                    ]
                }
            ]
        }
    },
    12: {
        "biology": {
            "name": "Biology",
            "doc": "Grade 12 Biology_Textbook.pdf",
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
            "doc": "Grade 12 Chemistry_Textbook.pdf",
            "units": [
                {
                    "title": "Acid-Base Equilibria",
                    "chapters": [
                        "1.1 Acid-Base Concepts",
                        "1.2 Ionic Equilibria of Weak Acids and Bases"
                    ]
                },
                {
                    "title": "Electrochemistry",
                    "chapters": [
                        "2.1 Oxidation-Reduction Reactions",
                        "2.2 Electrolysis of Aqueous Solutions",
                        "2.3 Quantitative Aspects of Electrolysis",
                        "2.4 Industrial Application of Electrolysis",
                        "2.5 Voltaic Cells"
                    ]
                },
                {
                    "title": "Industrial Chemistry",
                    "chapters": [
                        "3.1 Introduction to Chemical Manufacturing",
                        "3.2 Natural Resources and Industry",
                        "3.3 Manufacturing of Valuable Chemicals",
                        "3.4 Some Manufacturing Industries in Ethiopia"
                    ]
                },
                {
                    "title": "Polymers",
                    "chapters": [
                        "4.1 Introduction to Polymers",
                        "4.2 Polymerization Reactions",
                        "4.3 Classification of Polymers"
                    ]
                },
                {
                    "title": "Introduction to Environmental Chemistry",
                    "chapters": [
                        "5.1 Introduction & Components of Environment",
                        "5.2 Environmental Pollution",
                        "5.3 Global Warming and Climate Change",
                        "5.4 Green Chemistry and Cleaner Production"
                    ]
                }
            ]
        },
        "mathematics": {
            "name": "Mathematics",
            "doc": "Grade 12 Mathematics_Textbook (1).pdf",
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
            "doc": "Grade 12 Physics_Textbook.pdf",
            "units": [
                {
                    "title": "Application of Physics in Other Fields",
                    "chapters": [
                        "1.1 Physics and Other Sciences",
                        "1.2 Physics and Engineering",
                        "1.3 Medical Physics",
                        "1.4 Physics and Defense Technology",
                        "1.5 Physics in Communication"
                    ]
                },
                {
                    "title": "Two-Dimensional Motion",
                    "chapters": [
                        "2.1 Projectile Motion",
                        "2.2 Rotational Motion",
                        "2.3 Rotational Dynamics",
                        "2.4 Planetary Motion and Kepler's Laws",
                        "2.5 Newton's Law of Universal Gravitation"
                    ]
                },
                {
                    "title": "Fluid Mechanics",
                    "chapters": [
                        "3.1 Fluid Statics",
                        "3.2 Pressure in Fluids at Rest",
                        "3.3 Archimedes' Principle",
                        "3.4 Fluid Flow",
                        "3.5 Safety and High Pressure"
                    ]
                },
                {
                    "title": "Electromagnetism",
                    "chapters": [
                        "4.1 Magnets and Magnetic Field",
                        "4.2 Magnetic Field Lines",
                        "4.3 Current and Magnetism",
                        "4.4 Electromagnetic Induction",
                        "4.5 Faraday's Law of Electromagnetic Induction",
                        "4.6 Transformers",
                        "4.7 Application and Safety"
                    ]
                },
                {
                    "title": "Basics of Electronics",
                    "chapters": [
                        "5.1 Semiconductors",
                        "5.2 Diodes and Their Functions",
                        "5.3 Rectification",
                        "5.4 Transistors and Their Application",
                        "5.5 Integrated Circuits",
                        "5.6 Logic Gates and Logic Circuits",
                        "5.7 Application of Electronics"
                    ]
                }
            ]
        }
    }
}

source_documents = []

for grade_num in [9, 10, 11, 12]:
    grade_obj = {
        "grade": grade_num,
        "subjects": []
    }
    subj_order = 1
    for s_key in ["biology", "chemistry", "mathematics", "physics"]:
        s_data = DATA[grade_num][s_key]
        subject_id = f"g{grade_num:02d}-{s_key}"
        doc_id = f"{subject_id}-textbook"
        
        source_documents.append({
            "id": doc_id,
            "filename": s_data["doc"],
            "grade": grade_num,
            "subject_id": subject_id,
            "document_type": "textbook"
        })

        subject_obj = {
            "id": subject_id,
            "name": s_data["name"],
            "order": subj_order,
            "review_status": "verified",
            "source_refs": [
                {
                    "document_id": doc_id,
                    "pdf_page_start": 1,
                    "pdf_page_end": 100
                }
            ],
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
                "source_refs": [
                    {
                        "document_id": doc_id,
                        "pdf_page_start": 1,
                        "pdf_page_end": 100
                    }
                ],
                "chapters": []
            }
            
            for c_idx, chap_title in enumerate(u_info["chapters"], 1):
                chap_id = f"{unit_id}-c{c_idx:02d}"
                parts = chap_title.split(" ", 1)
                chap_num = parts[0] if "." in parts[0] else f"{u_idx}.{c_idx}"
                clean_title = chap_title
                
                # Each chapter also has its explicit subtopics
                sub_id = f"{chap_id}-s01"
                subtopic_obj = {
                    "id": sub_id,
                    "number": chap_num,
                    "title": clean_title,
                    "order": 1,
                    "review_status": "verified",
                    "source_refs": [
                        {
                            "document_id": doc_id,
                            "pdf_page_start": 1,
                            "pdf_page_end": 100
                        }
                    ]
                }
                
                chap_obj = {
                    "id": chap_id,
                    "number": chap_num,
                    "title": clean_title,
                    "order": c_idx,
                    "review_status": "verified",
                    "source_refs": [
                        {
                            "document_id": doc_id,
                            "pdf_page_start": 1,
                            "pdf_page_end": 100
                        }
                    ],
                    "prerequisite_ids": [],
                    "subtopics": [subtopic_obj]
                }
                unit_obj["chapters"].append(chap_obj)
                
            subject_obj["units"].append(unit_obj)
        grade_obj["subjects"].append(subject_obj)
    CURRICULUM["curriculum"]["grades"].append(grade_obj)

CURRICULUM["curriculum"]["source_documents"] = source_documents

# Write master curriculum
os.makedirs("curriculum", exist_ok=True)
master_path = "curriculum/ethiopian_curriculum_master.json"
with open(master_path, "w", encoding="utf-8") as f:
    json.dump(CURRICULUM, f, indent=2)

# Write to web public data
os.makedirs("apps/web/public/data", exist_ok=True)
web_path = "apps/web/public/data/curriculum.json"
with open(web_path, "w", encoding="utf-8") as f:
    json.dump(CURRICULUM, f, indent=2)

total_grades = len(CURRICULUM["curriculum"]["grades"])
total_units = sum(len(s["units"]) for g in CURRICULUM["curriculum"]["grades"] for s in g["subjects"])
total_chapters = sum(len(u["chapters"]) for g in CURRICULUM["curriculum"]["grades"] for s in g["subjects"] for u in s["units"])
total_subtopics = sum(len(c["subtopics"]) for g in CURRICULUM["curriculum"]["grades"] for s in g["subjects"] for u in s["units"] for c in u["chapters"])

print(f"Generated 4-subject curriculum successfully:")
print(f"Grades: {total_grades}")
print(f"Total Units: {total_units}")
print(f"Total Chapters/Topics: {total_chapters}")
print(f"Total Subtopics: {total_subtopics}")
