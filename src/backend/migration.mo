import Map "mo:core/Map";

module {
  public type OldRegulatoryBody = {
    name : Text;
    bodyType : {
      #national;
      #state;
      #consumer;
    };
    state : ?Text;
    description : Text;
    email : Text;
    phone : Text;
    website : Text;
    displayOrder : Nat;
  };

  public type NewRegulatoryBody = {
    name : Text;
    bodyType : {
      #national;
      #state;
      #consumer;
    };
    state : ?Text;
    description : Text;
    email : Text;
    phone : Text;
    website : Text;
    displayOrder : Nat;
    address : ?Text;
    helpline : ?Text;
  };

  public type OldActor = {
    regulatoryBodies : Map.Map<Text, OldRegulatoryBody>;
  };

  public type NewActor = {
    regulatoryBodies : Map.Map<Text, NewRegulatoryBody>;
  };

  public func run(old : OldActor) : NewActor {
    let newRegulatoryBodies = old.regulatoryBodies.map<Text, OldRegulatoryBody, NewRegulatoryBody>(
      func(_, oldBody) {
        {
          oldBody with
          address = null;
          helpline = null;
        };
      }
    );
    { regulatoryBodies = newRegulatoryBodies };
  };
};
